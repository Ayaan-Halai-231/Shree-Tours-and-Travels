using System;
using System.ComponentModel.DataAnnotations;

namespace SomnathTravels.Api.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string ContactNo { get; set; }

        [Required]
        public string StartDestination { get; set; }

        [Required]
        public string EndDestination { get; set; }

        [Required]
        public DateTime PickupDate { get; set; }

        [Required]
        public string Vehicle { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
