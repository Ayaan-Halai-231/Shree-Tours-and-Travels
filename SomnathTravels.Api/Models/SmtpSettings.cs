namespace SomnathTravels.Api.Models
{
    public class SmtpSettings
    {
        public string Server { get; set; } = "smtp.gmail.com";
        public int Port { get; set; } = 587;
        public string SenderName { get; set; } = "Shree Tours and Travels";
        public string SenderEmail { get; set; } = "shreetourstravels50052@gmail.com";
        public string Username { get; set; } = "shreetourstravels50052@gmail.com";
        public string Password { get; set; } = "";
        public bool EnableSsl { get; set; } = true;
        public string AdminEmail { get; set; } = "shreetourstravels50052@gmail.com";
    }
}
