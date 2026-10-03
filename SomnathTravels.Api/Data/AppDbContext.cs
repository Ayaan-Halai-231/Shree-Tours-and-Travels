using Microsoft.EntityFrameworkCore;
using SomnathTravels.Api.Models;

namespace SomnathTravels.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
    }
}
