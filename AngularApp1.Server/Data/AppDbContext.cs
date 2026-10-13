using AngularApp1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AngularApp1.Server.Data;
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(e =>
        {
            e.Property(p => p.Weight).HasColumnType("decimal(8,2)");
            e.Property(p => p.Price).HasColumnType("decimal(18,2)");

            // Shuruati data. Photo ka URL chahiye to Image = "https://..." likh sakte ho
            e.HasData(
                new Product { Id = 1, Name = "Royal Gold Ring", Category = "Rings", Metal = "22K Gold", Weight = 5.5m, Price = 32000m, Symbol = "ring" },
                new Product { Id = 2, Name = "Solitaire Diamond Ring", Category = "Diamonds", Metal = "Diamond", Weight = 4.2m, Price = 58000m, Symbol = "ring" },
                new Product { Id = 3, Name = "Bridal Necklace Set", Category = "Necklaces", Metal = "22K Gold", Weight = 38m, Price = 245000m, Symbol = "necklace" },
                new Product { Id = 4, Name = "Temple Design Haar", Category = "Necklaces", Metal = "22K Gold", Weight = 25m, Price = 168000m, Symbol = "necklace" },
                new Product { Id = 5, Name = "Jhumka Earrings", Category = "Earrings", Metal = "22K Gold", Weight = 8m, Price = 52000m, Symbol = "earring" },
                new Product { Id = 6, Name = "Diamond Studs", Category = "Diamonds", Metal = "Diamond", Weight = 2.5m, Price = 36000m, Symbol = "diamond" },
                new Product { Id = 7, Name = "Classic Gold Bangles", Category = "Bangles", Metal = "22K Gold", Weight = 20m, Price = 135000m, Symbol = "bangle" },
                new Product { Id = 8, Name = "Gold Heart Pendant", Category = "Pendants", Metal = "22K Gold", Weight = 3.2m, Price = 18500m, Symbol = "pendant" },
                new Product { Id = 9, Name = "Classic Gold Chain", Category = "Chains", Metal = "22K Gold", Weight = 12m, Price = 78000m, Symbol = "necklace" },
                new Product { Id = 10, Name = "Rope Design Chain", Category = "Chains", Metal = "22K Gold", Weight = 18m, Price = 118000m, Symbol = "necklace" },
                new Product { Id = 11, Name = "Traditional Mangalsutra", Category = "Mangalsutra", Metal = "22K Gold", Weight = 16m, Price = 98000m, Symbol = "pendant" },
                new Product { Id = 12, Name = "Diamond Mangalsutra", Category = "Mangalsutra", Metal = "Diamond", Weight = 9m, Price = 74000m, Symbol = "pendant" },
                new Product { Id = 13, Name = "Gold Link Bracelet", Category = "Bracelets", Metal = "22K Gold", Weight = 14m, Price = 92000m, Symbol = "bangle" },
                new Product { Id = 14, Name = "Charm Bracelet", Category = "Bracelets", Metal = "22K Gold", Weight = 10m, Price = 64000m, Symbol = "bangle" },
                new Product { Id = 15, Name = "Silver Payal Pair", Category = "Anklets", Metal = "Silver", Weight = 45m, Price = 5200m, Symbol = "bangle" },
                new Product { Id = 16, Name = "Silver Anklet with Bells", Category = "Anklets", Metal = "Silver", Weight = 38m, Price = 4400m, Symbol = "bangle" }
            );
        });
    }
}