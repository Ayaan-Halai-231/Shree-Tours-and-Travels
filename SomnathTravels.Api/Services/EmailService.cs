using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using SomnathTravels.Api.Models;

namespace SomnathTravels.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<SmtpSettings> settings, ILogger<EmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<(bool customerSent, bool adminSent)> SendBookingEmailsAsync(Booking booking)
        {
            bool customerSent = false;
            bool adminSent = false;

            try
            {
                customerSent = await SendBookingConfirmationToCustomerAsync(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while sending customer confirmation email for booking #{Id}", booking.Id);
            }

            try
            {
                adminSent = await SendBookingAlertToAdminAsync(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while sending admin alert email for booking #{Id}", booking.Id);
            }

            return (customerSent, adminSent);
        }

        public bool IsValidEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                var trimmed = email.Trim();
                var addr = new System.Net.Mail.MailAddress(trimmed);
                return addr.Address.Equals(trimmed, StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> SendBookingConfirmationToCustomerAsync(Booking booking, Car? car = null)
        {
            if (!IsValidEmail(booking.Email))
            {
                _logger.LogWarning("Invalid customer email address '{Email}' for booking #{Id}. Email delivery cancelled.", booking.Email, booking.Id);
                return false;
            }

            var subject = $"Booking Confirmed #{booking.Id} - Shree Tours & Travels";
            var body = BuildCustomerEmailHtml(booking, car);
            var plainText = BuildCustomerEmailPlainText(booking, car);

            return await SendEmailAsync(booking.Email, booking.FullName, subject, body, plainText);
        }

        public async Task<bool> SendBookingConfirmationToAdminAsync(Booking booking, Car? car = null)
        {
            var adminEmail = string.IsNullOrWhiteSpace(_settings.AdminEmail) ? "shreetourstravels50052@gmail.com" : _settings.AdminEmail;
            var subject = $"✅ Booking Confirmed #{booking.Id}: {booking.FullName} ({booking.Vehicle})";
            var body = BuildAdminConfirmationEmailHtml(booking, car);
            var plainText = BuildAdminConfirmationEmailPlainText(booking, car);

            return await SendEmailAsync(adminEmail, "Admin - Shree Tours & Travels", subject, body, plainText);
        }

        public async Task<bool> SendBookingAlertToAdminAsync(Booking booking)
        {
            var adminEmail = string.IsNullOrWhiteSpace(_settings.AdminEmail) ? "shreetourstravels50052@gmail.com" : _settings.AdminEmail;
            var subject = $"🚨 New Booking Alert #{booking.Id}: {booking.FullName} ({booking.Vehicle})";
            var body = BuildAdminEmailHtml(booking);
            var plainText = BuildAdminEmailPlainText(booking);

            return await SendEmailAsync(adminEmail, "Admin - Shree Tours & Travels", subject, body, plainText);
        }

        public async Task<bool> TestSmtpConnectionAsync(string recipientEmail)
        {
            var subject = "Test Email from Shree Tours & Travels SMTP System";
            var body = @"
                <div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc;'>
                    <div style='max-width: 500px; margin: auto; background: white; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0;'>
                        <h2 style='color: #0f172a; margin-top: 0;'>SMTP Configuration Test</h2>
                        <p style='color: #334155;'>Congratulations! Your SMTP settings in Shree Tours & Travels are working correctly.</p>
                        <p style='color: #64748b; font-size: 13px;'>Sent at: " + DateTime.UtcNow.ToString("dd-MM-yyyy HH:mm:ss") + @" UTC</p>
                    </div>
                </div>";

            return await SendEmailAsync(recipientEmail, "Administrator", subject, body, "SMTP Configuration Test: Success");
        }

        private async Task<bool> SendEmailAsync(string toEmail, string toName, string subject, string htmlBody, string? textBody = null)
        {
            if (string.IsNullOrWhiteSpace(_settings.Server))
            {
                _logger.LogWarning("SMTP Server is not configured. Email to {ToEmail} skipped.", toEmail);
                return false;
            }

            try
            {
                var message = new MimeMessage();
                var senderEmail = !string.IsNullOrWhiteSpace(_settings.SenderEmail) 
                    ? _settings.SenderEmail 
                    : (_settings.Username ?? "shreetourstravels50052@gmail.com");

                message.From.Add(new MailboxAddress(_settings.SenderName ?? "Shree Tours & Travels", senderEmail));
                message.ReplyTo.Add(new MailboxAddress(_settings.SenderName ?? "Shree Tours & Travels", senderEmail));
                message.To.Add(new MailboxAddress(toName ?? toEmail, toEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody,
                    TextBody = textBody ?? "Booking notification from Shree Tours & Travels"
                };
                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();

                // For development / local testing flexibility:
                client.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;

                var secureSocketOptions = _settings.Port == 465
                    ? SecureSocketOptions.SslOnConnect
                    : (_settings.EnableSsl ? SecureSocketOptions.StartTlsWhenAvailable : SecureSocketOptions.Auto);

                _logger.LogInformation("Connecting to SMTP server {Server}:{Port}...", _settings.Server, _settings.Port);
                await client.ConnectAsync(_settings.Server, _settings.Port, secureSocketOptions);

                if (!string.IsNullOrWhiteSpace(_settings.Username) && !string.IsNullOrWhiteSpace(_settings.Password))
                {
                    _logger.LogInformation("Authenticating SMTP user {Username}...", _settings.Username);
                    var cleanPassword = _settings.Password.Replace(" ", "").Trim();
                    await client.AuthenticateAsync(_settings.Username.Trim(), cleanPassword);
                }

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("SMTP email successfully sent to {ToEmail} [Subject: {Subject}]", toEmail, subject);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {ToEmail}. Error: {Message}", toEmail, ex.Message);
                return false;
            }
        }

        private string BuildCustomerEmailHtml(Booking booking, Car? car = null)
        {
            var formattedDate = booking.PickupDate != default 
                ? booking.PickupDate.ToString("dddd, dd MMMM yyyy") 
                : "To be confirmed";

            var totalAmountDisplay = booking.TotalAmount.HasValue && booking.TotalAmount.Value > 0
                ? $"₹{booking.TotalAmount.Value:N2}"
                : "To be calculated at trip start";

            var carDetailsHtml = car != null
                ? $@"
                  <tr>
                    <td class='label'>Vehicle Model</td>
                    <td class='value' style='color: #0f172a; font-weight: 700;'>{car.Brand} {car.Model} ({car.Name})</td>
                  </tr>
                  <tr>
                    <td class='label'>Car Specifications</td>
                    <td class='value'>{car.SeatingCapacity} Seats &bull; {car.FuelType ?? "Petrol/Diesel"} &bull; {car.Transmission ?? "Manual"} &bull; {(car.HasAirConditioning ? "AC" : "Non-AC")}</td>
                  </tr>"
                : $@"
                  <tr>
                    <td class='label'>Vehicle Category</td>
                    <td class='value' style='color: #0f172a; font-weight: 700;'>{booking.Vehicle}</td>
                  </tr>
                  <tr>
                    <td class='label'>Car Amenities</td>
                    <td class='value'>Air Conditioned &bull; Clean & Sanitized &bull; Chauffeur Driven</td>
                  </tr>";

            return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 35px 30px; text-align: center; border-bottom: 4px solid #10b981; }}
    .brand-title {{ font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 0.5px; }}
    .brand-title span {{ color: #ffc107; }}
    .brand-sub {{ color: #94a3b8; font-size: 13px; text-transform: uppercase; margin-top: 6px; letter-spacing: 1.5px; }}
    .badge {{ display: inline-block; background-color: #10b981; color: white; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; margin-top: 15px; letter-spacing: 0.5px; }}
    .body {{ padding: 30px; color: #334155; line-height: 1.6; }}
    .greeting {{ font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }}
    .intro {{ color: #475569; font-size: 15px; margin-bottom: 25px; }}
    .details-table {{ width: 100%; border-collapse: collapse; margin-bottom: 25px; background: #f8fafc; border-radius: 8px; overflow: hidden; }}
    .details-table td {{ padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }}
    .details-table td.label {{ font-weight: 600; color: #64748b; width: 38%; }}
    .details-table td.value {{ font-weight: 600; color: #0f172a; }}
    .amount-card {{ background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; padding: 18px 24px; border-radius: 8px; margin-bottom: 25px; text-align: center; }}
    .amount-label {{ font-size: 13px; font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 1px; }}
    .amount-value {{ font-size: 28px; font-weight: 800; color: #047857; margin-top: 4px; }}
    .highlight-box {{ background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 6px; margin-bottom: 25px; }}
    .highlight-box p {{ margin: 0; color: #92400e; font-size: 14px; font-weight: 500; }}
    .footer {{ background-color: #f8fafc; padding: 25px 30px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }}
    .footer a {{ color: #f59e0b; text-decoration: none; font-weight: 600; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1 class='brand-title'>Shree <span>Tours and Travels</span></h1>
      <div class='brand-sub'>Premium Car Rental & Travel Services</div>
      <div><span class='badge'>✓ BOOKING CONFIRMED BY ADMIN</span></div>
    </div>
    <div class='body'>
      <div class='greeting'>Dear {booking.FullName},</div>
      <p class='intro'>Great news! Your booking with <strong>Shree Tours & Travels</strong> has been officially confirmed by our admin. We are looking forward to serving you.</p>
      
      <!-- Total Amount Box -->
      <div class='amount-card'>
        <div class='amount-label'>Total Booking Amount</div>
        <div class='amount-value'>{totalAmountDisplay}</div>
      </div>

      <table class='details-table'>
        <tr>
          <td class='label'>Booking Reference</td>
          <td class='value' style='color: #0f172a; font-weight: 700;'>#{booking.Id}</td>
        </tr>
        <tr>
          <td class='label'>Booking Status</td>
          <td class='value'><span style='color: #10b981; font-weight: 700;'>CONFIRMED</span></td>
        </tr>
        {carDetailsHtml}
        <tr>
          <td class='label'>Pick-up Date</td>
          <td class='value' style='color: #b45309;'>{formattedDate}</td>
        </tr>
        <tr>
          <td class='label'>Travel Route</td>
          <td class='value'>{booking.StartDestination} ➔ {booking.EndDestination}</td>
        </tr>
        <tr>
          <td class='label'>Passenger Contact</td>
          <td class='value'>{booking.ContactNo}</td>
        </tr>
        <tr>
          <td class='label'>Registered Email</td>
          <td class='value'>{booking.Email}</td>
        </tr>
      </table>

      <div class='highlight-box'>
        <p><strong>Chauffeur & Vehicle Allocation:</strong><br/>Your driver contact and vehicle license plate number will be sent via SMS / WhatsApp to <strong>{booking.ContactNo}</strong> 2 hours prior to your scheduled pickup.</p>
      </div>

      <p style='font-size: 14px; color: #64748b; margin-bottom: 0;'>
        Need any modifications or special arrangements? Reach our 24/7 helpline at <strong>+91 9054450052</strong>.
      </p>
    </div>
    <div class='footer'>
      <p style='margin: 0 0 8px 0;'><strong>Shree Tours and Travels</strong></p>
      <p style='margin: 0 0 8px 0;'>Direct Support: <a href='tel:9054450052'>+91 9054450052</a> | Admin Email: <a href='mailto:shreetourstravels50052@gmail.com'>shreetourstravels50052@gmail.com</a></p>
      <p style='margin: 0; color: #94a3b8; font-size: 12px;'>© 2026 Shree Tours & Travels. All rights reserved.</p>
    </div>
  </div>
</body>
</html>";
        }

        private string BuildAdminEmailHtml(Booking booking)
        {
            var formattedDate = booking.PickupDate != default 
                ? booking.PickupDate.ToString("dddd, dd MMMM yyyy") 
                : "To be confirmed";

            return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
    .header {{ background: #0f172a; color: #ffffff; padding: 30px; text-align: center; border-bottom: 4px solid #ef4444; }}
    .badge {{ display: inline-block; background-color: #ef4444; color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }}
    .body {{ padding: 30px; color: #334155; line-height: 1.6; }}
    .details-table {{ width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; background: #f8fafc; border-radius: 8px; overflow: hidden; }}
    .details-table td {{ padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }}
    .details-table td.label {{ font-weight: 600; color: #64748b; width: 38%; }}
    .details-table td.value {{ font-weight: 700; color: #0f172a; }}
    .actions {{ background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 6px; }}
    .footer {{ background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <span class='badge'>🚨 New Customer Booking Alert</span>
      <h2 style='margin: 12px 0 0 0; color: #f8fafc;'>Shree Tours & Travels Admin</h2>
    </div>
    <div class='body'>
      <p style='font-size: 15px; color: #334155;'>A new booking has just been submitted on the website. Here are the customer and travel specifications:</p>
      
      <table class='details-table'>
        <tr>
          <td class='label'>Booking ID</td>
          <td class='value'>#{booking.Id}</td>
        </tr>
        <tr>
          <td class='label'>Customer Name</td>
          <td class='value'>{booking.FullName}</td>
        </tr>
        <tr>
          <td class='label'>Contact Phone</td>
          <td class='value'><a href='tel:{booking.ContactNo}' style='color: #0284c7; text-decoration: none;'>{booking.ContactNo}</a></td>
        </tr>
        <tr>
          <td class='label'>Customer Email</td>
          <td class='value'><a href='mailto:{booking.Email}' style='color: #0284c7; text-decoration: none;'>{booking.Email}</a></td>
        </tr>
        <tr>
          <td class='label'>Vehicle Requested</td>
          <td class='value' style='color: #d97706;'>{booking.Vehicle}</td>
        </tr>
        <tr>
          <td class='label'>Travel Route</td>
          <td class='value'>{booking.StartDestination} ➔ {booking.EndDestination}</td>
        </tr>
        <tr>
          <td class='label'>Pick-up Date</td>
          <td class='value'>{formattedDate}</td>
        </tr>
        <tr>
          <td class='label'>Booking Created At</td>
          <td class='value'>{DateTime.Now:dd-MM-yyyy hh:mm tt}</td>
        </tr>
      </table>

      <div class='actions'>
        <p style='margin: 0; color: #065f46; font-size: 14px;'>
          <strong>Action Required:</strong> Please contact the customer at <strong>{booking.ContactNo}</strong> to verify the pickup location and assign an available driver.
        </p>
      </div>
    </div>
    <div class='footer'>
      Shree Tours & Travels Administration System &bull; shreetourstravels50052@gmail.com
    </div>
  </div>
</body>
</html>";
        }

        private string BuildCustomerEmailPlainText(Booking booking, Car? car = null)
        {
            var formattedDate = booking.PickupDate != default 
                ? booking.PickupDate.ToString("dddd, dd MMMM yyyy") 
                : "To be confirmed";

            var totalAmountDisplay = booking.TotalAmount.HasValue && booking.TotalAmount.Value > 0
                ? $"Rs. {booking.TotalAmount.Value:N2}"
                : "To be calculated at trip start";

            var carInfo = car != null
                ? $"{car.Brand} {car.Model} ({car.Name}) - {car.SeatingCapacity} Seats, {car.FuelType ?? "Petrol/Diesel"}, {(car.HasAirConditioning ? "AC" : "Non-AC")}"
                : $"{booking.Vehicle} (AC Cab, Chauffeur Driven)";

            return $@"SHREE TOURS AND TRAVELS - BOOKING CONFIRMATION

Dear {booking.FullName},

Your booking with Shree Tours & Travels has been officially confirmed by our admin.

TOTAL BOOKING AMOUNT: {totalAmountDisplay}

Booking Reference: #{booking.Id}
Status: CONFIRMED
Car Information: {carInfo}
Pick-up Date: {formattedDate}
Travel Route: {booking.StartDestination} -> {booking.EndDestination}
Contact Phone: {booking.ContactNo}
Registered Email: {booking.Email}

Chauffeur & Vehicle Allocation:
Your driver contact and vehicle plate number will be sent via SMS / WhatsApp to {booking.ContactNo} 2 hours prior to scheduled pickup.

If you have any questions or require modifications, call us at +91 9054450052.

Support: +91 9054450052 | Email: shreetourstravels50052@gmail.com
(c) 2026 Shree Tours & Travels. All rights reserved.";
        }

        private string BuildAdminEmailPlainText(Booking booking)
        {
            var formattedDate = booking.PickupDate != default 
                ? booking.PickupDate.ToString("dddd, dd MMMM yyyy") 
                : "To be confirmed";

            return $@"SHREE TOURS & TRAVELS - NEW BOOKING ALERT

Booking ID: #{booking.Id}
Customer Name: {booking.FullName}
Contact Phone: {booking.ContactNo}
Customer Email: {booking.Email}
Vehicle Requested: {booking.Vehicle}
Travel Route: {booking.StartDestination} -> {booking.EndDestination}
Pick-up Date: {formattedDate}
Booking Created At: {DateTime.Now:dd-MM-yyyy hh:mm tt}

Action Required: Please contact the customer at {booking.ContactNo} to verify the pickup location and assign an available driver.";
        }

        private string BuildAdminConfirmationEmailHtml(Booking booking, Car? car = null)
        {
            var formattedDate = booking.PickupDate != default 
                ? booking.PickupDate.ToString("dddd, dd MMMM yyyy") 
                : "To be confirmed";

            var totalAmountDisplay = booking.TotalAmount.HasValue && booking.TotalAmount.Value > 0
                ? $"₹{booking.TotalAmount.Value:N2}"
                : "To be calculated";

            var carName = car != null ? $"{car.Brand} {car.Model} ({car.Name})" : booking.Vehicle;

            return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
    .header {{ background: #0f172a; color: #ffffff; padding: 30px; text-align: center; border-bottom: 4px solid #10b981; }}
    .badge {{ display: inline-block; background-color: #10b981; color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }}
    .body {{ padding: 30px; color: #334155; line-height: 1.6; }}
    .details-table {{ width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; background: #f8fafc; border-radius: 8px; overflow: hidden; }}
    .details-table td {{ padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }}
    .details-table td.label {{ font-weight: 600; color: #64748b; width: 38%; }}
    .details-table td.value {{ font-weight: 700; color: #0f172a; }}
    .summary-card {{ background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 6px; margin-bottom: 20px; }}
    .footer {{ background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <span class='badge'>✓ BOOKING CONFIRMED NOTIFICATION</span>
      <h2 style='margin: 12px 0 0 0; color: #f8fafc;'>Shree Tours & Travels Admin</h2>
    </div>
    <div class='body'>
      <div class='summary-card'>
        <p style='margin: 0; color: #065f46; font-size: 15px; font-weight: 600;'>
          Booking #{booking.Id} has been officially confirmed in the administrative system.
        </p>
        <p style='margin: 5px 0 0 0; color: #047857; font-size: 13px;'>
          Confirmation emails have been dispatched to both customer ({booking.Email}) and admin, along with WhatsApp and SMS notifications.
        </p>
      </div>
      
      <table class='details-table'>
        <tr>
          <td class='label'>Booking ID</td>
          <td class='value'>#{booking.Id}</td>
        </tr>
        <tr>
          <td class='label'>Status</td>
          <td class='value'><span style='color: #10b981; font-weight: 700;'>CONFIRMED</span></td>
        </tr>
        <tr>
          <td class='label'>Customer Name</td>
          <td class='value'>{booking.FullName}</td>
        </tr>
        <tr>
          <td class='label'>Contact Phone</td>
          <td class='value'><a href='tel:{booking.ContactNo}' style='color: #0284c7; text-decoration: none;'>{booking.ContactNo}</a></td>
        </tr>
        <tr>
          <td class='label'>Customer Email</td>
          <td class='value'><a href='mailto:{booking.Email}' style='color: #0284c7; text-decoration: none;'>{booking.Email}</a></td>
        </tr>
        <tr>
          <td class='label'>Vehicle</td>
          <td class='value' style='color: #0f172a;'>{carName}</td>
        </tr>
        <tr>
          <td class='label'>Travel Route</td>
          <td class='value'>{booking.StartDestination} ➔ {booking.EndDestination}</td>
        </tr>
        <tr>
          <td class='label'>Pick-up Date</td>
          <td class='value'>{formattedDate}</td>
        </tr>
        <tr>
          <td class='label'>Total Fare</td>
          <td class='value' style='color: #10b981; font-size: 16px;'>{totalAmountDisplay}</td>
        </tr>
        <tr>
          <td class='label'>Confirmed Timestamp</td>
          <td class='value'>{DateTime.Now:dd-MM-yyyy hh:mm tt}</td>
        </tr>
      </table>
    </div>
    <div class='footer'>
      Shree Tours & Travels Administration System &bull; shreetourstravels50052@gmail.com
    </div>
  </div>
</body>
</html>";
        }

        private string BuildAdminConfirmationEmailPlainText(Booking booking, Car? car = null)
        {
            var formattedDate = booking.PickupDate != default 
                ? booking.PickupDate.ToString("dddd, dd MMMM yyyy") 
                : "To be confirmed";

            var totalAmountDisplay = booking.TotalAmount.HasValue && booking.TotalAmount.Value > 0
                ? $"₹{booking.TotalAmount.Value:N2}"
                : "To be calculated";

            var carName = car != null ? $"{car.Brand} {car.Model} ({car.Name})" : booking.Vehicle;

            return $@"SHREE TOURS & TRAVELS - BOOKING CONFIRMED NOTIFICATION

Booking #{booking.Id} has been CONFIRMED by admin.

• Status: CONFIRMED
• Customer: {booking.FullName}
• Phone: {booking.ContactNo}
• Email: {booking.Email}
• Vehicle: {carName}
• Route: {booking.StartDestination} -> {booking.EndDestination}
• Pickup Date: {formattedDate}
• Total Fare: {totalAmountDisplay}
• Confirmed At: {DateTime.Now:dd-MM-yyyy hh:mm tt}

Confirmation email dispatched to customer ({booking.Email}) and admin, with SMS & WhatsApp notifications.";
        }
    }
}
