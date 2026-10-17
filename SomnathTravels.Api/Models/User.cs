using System.ComponentModel.DataAnnotations;

namespace SomnathTravels.Api.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        public string Role { get; set; } = "Admin";
    }
}
