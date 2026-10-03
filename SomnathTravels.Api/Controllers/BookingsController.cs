using Microsoft.AspNetCore.Mvc;
using SomnathTravels.Api.Data;
using SomnathTravels.Api.Models;
using System.Threading.Tasks;

namespace SomnathTravels.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] Booking booking)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking created successfully", bookingId = booking.Id });
        }
    }
}
