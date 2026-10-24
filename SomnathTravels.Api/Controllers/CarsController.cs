using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SomnathTravels.Api.Data;
using SomnathTravels.Api.Models;

namespace SomnathTravels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Cars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetCars()
        {
            return await _context.Cars.ToListAsync();
        }

        // GET: api/Cars/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound();
            }

            return car;
        }

        // PUT: api/Cars/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCar(int id, Car car)
        {
            if (id != car.Id)
            {
                return BadRequest();
            }

            if (string.IsNullOrWhiteSpace(car.RegistrationNumber))
            {
                car.RegistrationNumber = "N/A";
            }

            _context.Entry(car).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Cars
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Car>> PostCar(Car car)
        {
            if (string.IsNullOrWhiteSpace(car.RegistrationNumber))
            {
                car.RegistrationNumber = "N/A";
            }

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCar", new { id = car.Id }, car);
        }

        // DELETE: api/Cars/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Cars/5/availability
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/availability")]
        public async Task<IActionResult> UpdateAvailability(int id, [FromBody] string status)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            car.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Cars/stats
        [Authorize(Roles = "Admin")]
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var totalCars = await _context.Cars.CountAsync();
            var availableCars = await _context.Cars.CountAsync(c => c.Status == "Available");
            var unavailableCars = totalCars - availableCars;
            var totalBookings = await _context.Bookings.CountAsync();

            return new
            {
                TotalCars = totalCars,
                AvailableCars = availableCars,
                UnavailableCars = unavailableCars,
                TotalBookings = totalBookings,
                TotalRevenue = 0 // Placeholder
            };
        }

        // POST: api/Cars/upload-image
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file was uploaded." });
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext))
            {
                return BadRequest(new { message = "Only image files (.jpg, .jpeg, .png, .webp, .gif) are allowed." });
            }

            var webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadDir = Path.Combine(webRoot, "uploads", "cars");
            if (!Directory.Exists(uploadDir))
            {
                Directory.CreateDirectory(uploadDir);
            }

            var uniqueName = $"car_{Guid.NewGuid():N}{ext}";
            var filePath = Path.Combine(uploadDir, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";
            var imageUrl = $"{baseUrl}/uploads/cars/{uniqueName}";

            return Ok(new { url = imageUrl, fileName = uniqueName });
        }

        private bool CarExists(int id)
        {
            return _context.Cars.Any(e => e.Id == id);
        }
    }
}
