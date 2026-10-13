using System.Text.RegularExpressions;
using AngularApp1.Server.Data;
using AngularApp1.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularApp1.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(AppDbContext db, IWebHostEnvironment env) : ControllerBase
{
    // Sirf humari apni upload ki hui files hi delete hoti hain
    private static readonly Regex UploadPath = new(@"^/uploads/[0-9a-f]{32}\.(jpg|png|webp)$");

    [HttpGet]
    public async Task<IEnumerable<Product>> GetAll()
        => await db.Products.AsNoTracking().OrderBy(p => p.Id).ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> Get(int id)
    {
        var p = await db.Products.FindAsync(id);
        return p is null ? NotFound() : p;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Product>> Create(Product product)
    {
        product.Id = 0;
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Product product)
    {
        if (id != product.Id) return BadRequest();
        var existing = await db.Products.FindAsync(id);
        if (existing is null) return NotFound();

        var oldImage = existing.Image;
        db.Entry(existing).CurrentValues.SetValues(product);
        await db.SaveChangesAsync();

        if (oldImage != product.Image) DeleteUpload(oldImage);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await db.Products.FindAsync(id);
        if (p is null) return NotFound();

        var oldImage = p.Image;
        db.Products.Remove(p);
        await db.SaveChangesAsync();

        DeleteUpload(oldImage);
        return NoContent();
    }

    private void DeleteUpload(string? url)
    {
        if (url is null || !UploadPath.IsMatch(url)) return;
        var root = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var path = Path.Combine(root, "uploads", Path.GetFileName(url));
        try
        {
            if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
        }
        catch
        {
            // file hatne me dikkat ho to bhi gehne ka kaam rukna nahi chahiye
        }
    }
}