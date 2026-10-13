using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

namespace AngularApp1.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IConfiguration config) : ControllerBase
{
    public record LoginRequest(string? Username, string? Password);

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public IActionResult Login(LoginRequest req)
    {
        var user = config["Admin:Username"];
        var pass = config["Admin:Password"];
        if (string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass))
            return StatusCode(500, new { message = "Admin login is not configured." });

        // '&' (short-circuit nahi) taaki dono hamesha check hon
        var ok = Same(req.Username, user) & Same(req.Password, pass);
        if (!ok) return Unauthorized(new { message = "Invalid username or password." });

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: new[] { new Claim(ClaimTypes.Name, user) },
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), expires = token.ValidTo });
    }

    private static bool Same(string? input, string expected)
    {
        var a = SHA256.HashData(Encoding.UTF8.GetBytes(input ?? string.Empty));
        var b = SHA256.HashData(Encoding.UTF8.GetBytes(expected));
        return CryptographicOperations.FixedTimeEquals(a, b);
    }
}