using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SomnathTravels.Api.Data;
using SomnathTravels.Api.Models;
using SomnathTravels.Api.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SomnathTravels.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ITwilioService _twilioService;

        public BookingsController(AppDbContext context, IEmailService emailService, ITwilioService twilioService)
        {
            _context = context;
            _emailService = emailService;
            _twilioService = twilioService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            var bookings = await _context.Bookings
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
            return Ok(bookings);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] Booking booking)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Default status to Pending until admin confirms
            booking.Status = "Pending";

            // Determine estimated total amount based on vehicle or car catalog if not provided
            if (booking.TotalAmount == null || booking.TotalAmount <= 0)
            {
                var matchedCar = await _context.Cars
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == booking.Vehicle.ToLower() || booking.Vehicle.ToLower().Contains(c.Name.ToLower()));

                booking.TotalAmount = matchedCar?.RentPerDay ?? (
                    booking.Vehicle.ToLower().Contains("innova") ? 3500m :
                    booking.Vehicle.ToLower().Contains("city") ? 2500m :
                    booking.Vehicle.ToLower().Contains("dzire") ? 1800m : 2000m
                );
            }

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // 1. Send confirmation email to customer with car details, pickup date, and total amount
            bool customerEmailSent = false;
            try
            {
                var matchedCar = await _context.Cars
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == booking.Vehicle.ToLower() || booking.Vehicle.ToLower().Contains(c.Name.ToLower()));

                customerEmailSent = await _emailService.SendBookingConfirmationToCustomerAsync(booking, matchedCar);
            }
            catch (Exception ex)
            {
                // Non-blocking log
            }

            // 2. Send instant alert email to admin about new pending booking
            bool adminAlertSent = false;
            try
            {
                adminAlertSent = await _emailService.SendBookingAlertToAdminAsync(booking);
            }
            catch (Exception ex)
            {
                // Non-blocking log
            }

            // 3. Send Twilio SMS and WhatsApp notifications to customer and admin
            bool customerSms = false, customerWhatsApp = false, adminSms = false, adminWhatsApp = false;
            try
            {
                var matchedCar = await _context.Cars
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == booking.Vehicle.ToLower() || booking.Vehicle.ToLower().Contains(c.Name.ToLower()));
                (customerSms, customerWhatsApp, adminSms, adminWhatsApp) = await _twilioService.SendNewBookingNotificationsAsync(booking, matchedCar);
            }
            catch (Exception ex)
            {
                // Non-blocking log
            }

            return Ok(new 
            { 
                message = "Booking submitted successfully! Notifications sent to customer and admin.", 
                bookingId = booking.Id,
                status = booking.Status,
                totalAmount = booking.TotalAmount,
                customerEmailSent,
                adminAlertSent,
                customerSms,
                customerWhatsApp,
                adminSms,
                adminWhatsApp
            });
        }

        [HttpPost("{id}/confirm")]
        public async Task<IActionResult> ConfirmBooking(int id, [FromBody] ConfirmBookingRequestDto? request = null)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { success = false, message = $"Booking #{id} not found." });
            }

            // 1. Validate customer email address
            if (!_emailService.IsValidEmail(booking.Email))
            {
                return BadRequest(new 
                { 
                    success = false, 
                    message = $"Invalid customer registered email address: '{booking.Email}'. Cannot send confirmation email." 
                });
            }

            // 2. Update booking details (total amount if provided)
            if (request?.TotalAmount.HasValue == true && request.TotalAmount.Value > 0)
            {
                booking.TotalAmount = request.TotalAmount.Value;
            }
            else if (booking.TotalAmount == null || booking.TotalAmount <= 0)
            {
                var matchedCar = await _context.Cars
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == booking.Vehicle.ToLower() || booking.Vehicle.ToLower().Contains(c.Name.ToLower()));

                booking.TotalAmount = matchedCar?.RentPerDay ?? (
                    booking.Vehicle.ToLower().Contains("innova") ? 3500m :
                    booking.Vehicle.ToLower().Contains("city") ? 2500m :
                    booking.Vehicle.ToLower().Contains("dzire") ? 1800m : 2000m
                );
            }

            booking.Status = "Confirmed";

            // 3. Ensure booking is saved to DB BEFORE sending email
            await _context.SaveChangesAsync();

            // 4. Send confirmation email to BOTH customer and admin with car info, pickup date, and total amount
            var car = await _context.Cars
                .FirstOrDefaultAsync(c => c.Name.ToLower() == booking.Vehicle.ToLower() || booking.Vehicle.ToLower().Contains(c.Name.ToLower()));

            bool customerEmailSent = false;
            bool adminEmailSent = false;
            try
            {
                customerEmailSent = await _emailService.SendBookingConfirmationToCustomerAsync(booking, car);
            }
            catch (Exception ex)
            {
                // Error is logged by EmailService
            }

            try
            {
                adminEmailSent = await _emailService.SendBookingConfirmationToAdminAsync(booking, car);
            }
            catch (Exception ex)
            {
                // Error is logged by EmailService
            }

            // 5. Send confirmation WhatsApp and SMS notifications to BOTH customer and admin
            bool customerSms = false, customerWhatsApp = false, adminSms = false, adminWhatsApp = false;
            try
            {
                (customerSms, customerWhatsApp, adminSms, adminWhatsApp) = await _twilioService.SendConfirmedBookingNotificationsAsync(booking, car);
            }
            catch (Exception ex)
            {
                // Non-blocking log
            }

            bool anyEmailSent = customerEmailSent || adminEmailSent;

            return Ok(new 
            { 
                success = true, 
                message = anyEmailSent 
                    ? $"Booking #{booking.Id} confirmed successfully! Multi-channel notifications dispatched to customer and admin." 
                    : $"Booking #{booking.Id} confirmed in database. Email delivery could not complete.",
                bookingId = booking.Id,
                status = booking.Status,
                totalAmount = booking.TotalAmount,
                customerEmail = booking.Email,
                emailSent = customerEmailSent,
                customerEmailSent,
                adminEmailSent,
                customerSms,
                customerWhatsApp,
                adminSms,
                adminWhatsApp
            });
        }

        [HttpPost("test-smtp")]
        public async Task<IActionResult> TestSmtp([FromQuery] string recipient = "shreetourstravels50052@gmail.com")
        {
            var success = await _emailService.TestSmtpConnectionAsync(recipient);
            if (success)
            {
                return Ok(new { success = true, message = $"Test email sent successfully to {recipient}" });
            }
            return StatusCode(500, new { success = false, message = "Failed to send test email. Please check your SMTP settings in appsettings.json." });
        }

        [HttpPost("test-messaging")]
        public async Task<IActionResult> TestMessaging([FromQuery] string phone = "9054450052")
        {
            var testSms = await _twilioService.SendSmsAsync(phone, "Test SMS from Shree Tours & Travels booking system.");
            var testWa = await _twilioService.SendWhatsAppAsync(phone, "🚖 *Test WhatsApp Message* from Shree Tours & Travels booking system.");

            return Ok(new 
            { 
                phone, 
                smsSent = testSms, 
                whatsAppSent = testWa, 
                message = "Twilio messaging test completed. Check backend logs for detailed Twilio API response." 
            });
        }
    }
}
