using System.ComponentModel.DataAnnotations;

namespace AngularApp1.Server.Models;

public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;   // Rings, Necklaces...

    [MaxLength(50)]
    public string Metal { get; set; } = string.Empty;      // 22K Gold, Diamond, Silver...

    public decimal Weight { get; set; }                    // grams
    public decimal Price { get; set; }

    [MaxLength(30)]
    public string Symbol { get; set; } = "ring";           // ring, necklace, earring, bangle, diamond, pendant

    [MaxLength(1000)]
    public string? Image { get; set; }                     // photo 
}