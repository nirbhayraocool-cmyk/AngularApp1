using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AngularApp1.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadsController(IWebHostEnvironment env) : ControllerBase
{
    private const long MaxBytes = 5 * 1024 * 1024;

    [HttpPost]
    [RequestSizeLimit(MaxBytes + 64 * 1024)]
    public async Task<IActionResult> Upload(IFormFile? file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "Please choose a photo." });
        if (file.Length > MaxBytes)
            return BadRequest(new { message = "Photo is too large (max 5 MB)." });

        // File ke shuruati bytes padhkar asli type pata karo (naam par bharosa nahi)
        var header = new byte[12];
        await using (var s = file.OpenReadStream())
        {
            var read = await s.ReadAsync(header.AsMemory(0, header.Length));
            if (read < header.Length)
                return BadRequest(new { message = "This file is not a valid photo." });
        }

        var ext = DetectExtension(header);
        if (ext is null)
            return BadRequest(new { message = "Only JPG, PNG or WEBP photos are allowed." });

        var root = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var dir = Path.Combine(root, "uploads");
        Directory.CreateDirectory(dir);

        var name = Guid.NewGuid().ToString("N") + ext;
        await using (var fs = new FileStream(Path.Combine(dir, name), FileMode.CreateNew))
        {
            await file.CopyToAsync(fs);
        }

        return Ok(new { url = "/uploads/" + name });
    }

    private static string? DetectExtension(byte[] b)
    {
        // JPEG
        if (b[0] == 0xFF && b[1] == 0xD8 && b[2] == 0xFF) return ".jpg";
        // PNG
        if (b[0] == 0x89 && b[1] == 0x50 && b[2] == 0x4E && b[3] == 0x47 &&
            b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A) return ".png";
        // WEBP ("RIFF" .... "WEBP")
        if (b[0] == 0x52 && b[1] == 0x49 && b[2] == 0x46 && b[3] == 0x46 &&
            b[8] == 0x57 && b[9] == 0x45 && b[10] == 0x42 && b[11] == 0x50) return ".webp";
        return null;
    }
}