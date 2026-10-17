using SomnathTravels.Api.Models;
using System.Threading.Tasks;

namespace SomnathTravels.Api.Services
{
    public interface ITwilioService
    {
        Task<bool> SendSmsAsync(string toPhoneNumber, string message);
        Task<bool> SendWhatsAppAsync(string toPhoneNumber, string message);
        Task<(bool customerSms, bool customerWhatsApp, bool adminSms, bool adminWhatsApp)> SendNewBookingNotificationsAsync(Booking booking, Car? car = null);
        Task<(bool customerSms, bool customerWhatsApp, bool adminSms, bool adminWhatsApp)> SendConfirmedBookingNotificationsAsync(Booking booking, Car? car = null);
    }
}
