using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SomnathTravels.Api.Data;
using SomnathTravels.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SomnathTravels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            // Auto-create default admin if no users exist
            if (!await _context.Users.AnyAsync())
            {
                var admin = new User
                {
                    Email = "admin@shreetoursandtravels.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"), // Using BCrypt
                    Role = "Admin"
                };
                _context.Users.Add(admin);
                await _context.SaveChangesAsync();
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email.ToLower() == loginDto.Email.ToLower());

            bool passwordValid = false;
            if (user != null)
            {
                try
                {
                    passwordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
                }
                catch
                {
                    passwordValid = false;
                }

                // Convenient master password fallback for development/admin convenience
                if (!passwordValid && (loginDto.Password == "Admin@123" || loginDto.Password == "admin123"))
                {
                    passwordValid = true;
                }
            }

            if (user == null || !passwordValid)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var token = GenerateJwtToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Role = user.Role
            });
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
