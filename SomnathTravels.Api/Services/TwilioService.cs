using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SomnathTravels.Api.Models;

namespace SomnathTravels.Api.Services
{
    public class TwilioService : ITwilioService
    {
        private readonly TwilioSettings _settings;
        private readonly ILogger<TwilioService> _logger;
        private readonly HttpClient _httpClient;

        public TwilioService(IOptions<TwilioSettings> settings, ILogger<TwilioService> logger, HttpClient httpClient)
        {
            _settings = settings.Value;
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task<bool> SendSmsAsync(string toPhoneNumber, string message)
        {
            if (string.IsNullOrWhiteSpace(_settings.AccountSid) || string.IsNullOrWhiteSpace(_settings.AuthToken))
            {
                _logger.LogWarning("Twilio AccountSid or AuthToken is missing. SMS to {To} cancelled.", toPhoneNumber);
                return false;
            }

            var fromPhone = string.IsNullOrWhiteSpace(_settings.FromPhoneNumber) ? "+17372508034" : _settings.FromPhoneNumber;

            var e164To = FormatToE164(toPhoneNumber);
            if (string.IsNullOrWhiteSpace(e164To))
            {
                _logger.LogWarning("Invalid phone number format '{Phone}'. SMS skipped.", toPhoneNumber);
                return false;
            }

            // Twilio Free Trial accounts require the predefined trial template: "sms_appointment_reminders"
            var sent = await PostTwilioMessageAsync(e164To, fromPhone, "sms_appointment_reminders", "SMS");
            if (!sent)
            {
                // Fallback attempt with custom message if upgraded
                sent = await PostTwilioMessageAsync(e164To, fromPhone, message, "SMS");
            }

            return sent;
        }

        public async Task<bool> SendWhatsAppAsync(string toPhoneNumber, string message)
        {
            if (string.IsNullOrWhiteSpace(_settings.AccountSid) || string.IsNullOrWhiteSpace(_settings.AuthToken))
            {
                _logger.LogWarning("Twilio AccountSid or AuthToken is missing. WhatsApp to {To} cancelled.", toPhoneNumber);
                return false;
            }

            var fromWhatsApp = string.IsNullOrWhiteSpace(_settings.FromWhatsAppNumber)
                ? "whatsapp:+17372508034"
                : (_settings.FromWhatsAppNumber.StartsWith("whatsapp:") ? _settings.FromWhatsAppNumber : $"whatsapp:{_settings.FromWhatsAppNumber}");

            var e164To = FormatToE164(toPhoneNumber);
            if (string.IsNullOrWhiteSpace(e164To))
            {
                _logger.LogWarning("Invalid phone number format '{Phone}'. WhatsApp skipped.", toPhoneNumber);
                return false;
            }

            var toWhatsApp = $"whatsapp:{e164To}";
            return await PostTwilioMessageAsync(toWhatsApp, fromWhatsApp, message, "WhatsApp");
        }

        public async Task<(bool customerSms, bool customerWhatsApp, bool adminSms, bool adminWhatsApp)> SendNewBookingNotificationsAsync(Booking booking, Car? car = null)
        {
            var formattedDate = booking.PickupDate != default ? booking.PickupDate.ToString("dd MMM yyyy") : "TBD";
            var totalAmountStr = booking.TotalAmount.HasValue && booking.TotalAmount.Value > 0 ? $"₹{booking.TotalAmount.Value:N2}" : "To be calculated";

            // 1. Customer Notifications
            var customerSmsMsg = $"Namaste {booking.FullName}, your booking #{booking.Id} for {booking.Vehicle} on {formattedDate} ({booking.StartDestination} to {booking.EndDestination}) is received at Shree Tours & Travels. Est. fare: {totalAmountStr}. Support: +91 9054450052.";
            
            var customerWaMsg = $"🚖 *Shree Tours & Travels - Booking Received*\n\nNamaste *{booking.FullName}*,\n\nThank you for booking with us! We have received your trip request:\n\n• *Booking ID*: #{booking.Id}\n• *Vehicle*: {booking.Vehicle}\n• *Pickup Date*: {formattedDate}\n• *Route*: {booking.StartDestination} ➔ {booking.EndDestination}\n• *Estimated Amount*: {totalAmountStr}\n\nOur team is reviewing the itinerary and will confirm shortly.\n\nNeed urgent assistance? Call our 24/7 helpline at *+91 9054450052*.";

            var customerSms = await SendSmsAsync(booking.ContactNo, customerSmsMsg);
            var customerWa = await SendWhatsAppAsync(booking.ContactNo, customerWaMsg);

            // 2. Admin Notifications
            var adminPhone = string.IsNullOrWhiteSpace(_settings.AdminPhoneNumber) ? "+919054450052" : _settings.AdminPhoneNumber;
            
            var adminSmsMsg = $"🚨 New Booking #{booking.Id}: {booking.FullName} ({booking.ContactNo}), {booking.Vehicle}, Route: {booking.StartDestination}-{booking.EndDestination}, Date: {formattedDate}. Shree Tours.";

            var adminWaMsg = $"🚨 *New Booking Alert #{booking.Id}*\n\n• *Customer*: {booking.FullName}\n• *Phone*: {booking.ContactNo}\n• *Email*: {booking.Email}\n• *Vehicle*: {booking.Vehicle}\n• *Route*: {booking.StartDestination} ➔ {booking.EndDestination}\n• *Pickup Date*: {formattedDate}\n• *Amount*: {totalAmountStr}\n\nPlease review and confirm in the admin dashboard.";

            var adminSms = await SendSmsAsync(adminPhone, adminSmsMsg);
            var adminWa = await SendWhatsAppAsync(adminPhone, adminWaMsg);

            return (customerSms, customerWa, adminSms, adminWa);
        }

        public async Task<(bool customerSms, bool customerWhatsApp, bool adminSms, bool adminWhatsApp)> SendConfirmedBookingNotificationsAsync(Booking booking, Car? car = null)
        {
            var formattedDate = booking.PickupDate != default ? booking.PickupDate.ToString("dd MMM yyyy") : "TBD";
            var totalAmountStr = booking.TotalAmount.HasValue && booking.TotalAmount.Value > 0 ? $"₹{booking.TotalAmount.Value:N2}" : "To be calculated";
            var carInfo = car != null ? $"{car.Brand} {car.Model} ({car.Name})" : booking.Vehicle;

            // 1. Customer Notifications
            var customerSmsMsg = $"Great news {booking.FullName}! Booking #{booking.Id} for {carInfo} on {formattedDate} is CONFIRMED by Shree Tours & Travels. Total: {totalAmountStr}. Driver allocation sent 2 hrs prior. Helpline: +91 9054450052.";

            var customerWaMsg = $"✅ *Booking Confirmed - Shree Tours & Travels*\n\nDear *{booking.FullName}*,\n\nYour rental booking has been officially *CONFIRMED* by our team!\n\n• *Booking ID*: #{booking.Id}\n• *Vehicle*: {carInfo}\n• *Total Fare*: *{totalAmountStr}*\n• *Pickup Date*: {formattedDate}\n• *Route*: {booking.StartDestination} ➔ {booking.EndDestination}\n\nChauffeur and car license plate details will be sent 2 hours before pickup.\n\nHelpline: *+91 9054450052* | Have a pleasant journey!";

            var customerSms = await SendSmsAsync(booking.ContactNo, customerSmsMsg);
            var customerWa = await SendWhatsAppAsync(booking.ContactNo, customerWaMsg);

            // 2. Admin Notifications
            var adminPhone = string.IsNullOrWhiteSpace(_settings.AdminPhoneNumber) ? "+919054450052" : _settings.AdminPhoneNumber;

            var adminSmsMsg = $"✅ Booking #{booking.Id} ({booking.FullName}) confirmed in system. Total: {totalAmountStr}. Date: {formattedDate}.";

            var adminWaMsg = $"✅ *Booking #{booking.Id} Confirmed*\n\nCustomer: {booking.FullName}\nVehicle: {carInfo}\nFare: {totalAmountStr}\nPickup: {formattedDate}\nCustomer phone: {booking.ContactNo}";

            var adminSms = await SendSmsAsync(adminPhone, adminSmsMsg);
            var adminWa = await SendWhatsAppAsync(adminPhone, adminWaMsg);

            return (customerSms, customerWa, adminSms, adminWa);
        }

        private async Task<bool> PostTwilioMessageAsync(string to, string from, string body, string channelName)
        {
            try
            {
                var url = $"https://api.twilio.com/2010-04-01/Accounts/{_settings.AccountSid}/Messages.json";
                var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_settings.AccountSid}:{_settings.AuthToken}"));

                var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

                var formValues = new Dictionary<string, string>
                {
                    { "To", to },
                    { "From", from }
                };

                if (!string.IsNullOrWhiteSpace(_settings.ContentSid) && channelName == "WhatsApp")
                {
                    formValues.Add("ContentSid", _settings.ContentSid);
                }
                else
                {
                    formValues.Add("Body", body);
                }

                request.Content = new FormUrlEncodedContent(formValues);

                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Twilio {Channel} successfully sent to {To}", channelName, to);
                    return true;
                }
                else
                {
                    _logger.LogWarning("Twilio {Channel} delivery returned {StatusCode} for {To}: {Response}", channelName, response.StatusCode, to, responseContent);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while sending Twilio {Channel} to {To}: {Message}", channelName, to, ex.Message);
                return false;
            }
        }

        public static string FormatToE164(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return string.Empty;

            var digits = new string(phone.Where(char.IsDigit).ToArray());
            if (string.IsNullOrWhiteSpace(digits)) return string.Empty;

            if (digits.Length == 10)
            {
                return $"+91{digits}";
            }
            if (digits.Length == 11 && digits.StartsWith("0"))
            {
                return $"+91{digits.Substring(1)}";
            }
            if (digits.Length == 12 && digits.StartsWith("91"))
            {
                return $"+{digits}";
            }
            if (phone.Trim().StartsWith("+"))
            {
                return $"+{digits}";
            }

            return $"+{digits}";
        }
    }
}
