using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SomnathTravels.Api.Models
{
    public class Car
    {
        public int Id { get; set; }

        [Required, StringLength(300)]
        public required string Name { get; set; }

        [Required]
        public required string Brand { get; set; }

        [Required]
        public required string Model { get; set; }

        public int Year { get; set; }

        public string? RegistrationNumber { get; set; } = "N/A";

        public string? VehicleType { get; set; }
        public string? Transmission { get; set; }
        public string? FuelType { get; set; }
        public int SeatingCapacity { get; set; }
        public string? Color { get; set; }
        public string? Description { get; set; }

        // Pricing
        [Column(TypeName = "decimal(18,2)")]
        public decimal? RentPerHour { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal RentPerDay { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RentPerWeek { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RentPerMonth { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? SecurityDeposit { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ExtraKilometreCharge { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DriverCharge { get; set; }

        public int? MinimumBookingDuration { get; set; }
        public int? MaximumBookingDuration { get; set; }

        // Features
        public bool HasAirConditioning { get; set; }
        public bool HasGpsNavigation { get; set; }
        public bool HasBluetooth { get; set; }
        public bool HasSunroof { get; set; }
        public bool HasLeatherSeats { get; set; }
        public string? AdditionalFeatures { get; set; }

        public string Status { get; set; } = "Available"; // Available, Booked, Maintenance, Inactive
        
        public string? ImageUrls { get; set; } // Comma separated URLs for simplicity or JSON
    }
}
