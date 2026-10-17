using SomnathTravels.Api.Models;
using System.Threading.Tasks;

namespace SomnathTravels.Api.Services
{
    public interface IEmailService
    {
        Task<bool> SendBookingConfirmationToCustomerAsync(Booking booking, Car? car = null);
        Task<bool> SendBookingConfirmationToAdminAsync(Booking booking, Car? car = null);
        Task<bool> SendBookingAlertToAdminAsync(Booking booking);
        Task<(bool customerSent, bool adminSent)> SendBookingEmailsAsync(Booking booking);
        Task<bool> TestSmtpConnectionAsync(string recipientEmail);
        bool IsValidEmail(string? email);
    }
}
