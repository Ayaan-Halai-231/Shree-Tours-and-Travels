namespace SomnathTravels.Api.Models
{
    public class TwilioSettings
    {
        public string AccountSid { get; set; } = string.Empty;
        public string AuthToken { get; set; } = string.Empty;
        public string FromPhoneNumber { get; set; } = string.Empty;
        public string FromWhatsAppNumber { get; set; } = "whatsapp:+17372508034";
        public string AdminPhoneNumber { get; set; } = "+919054450052";
        public string? ContentSid { get; set; }
    }
}
