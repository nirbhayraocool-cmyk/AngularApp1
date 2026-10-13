using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AngularApp1.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Metal = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(8,2)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Symbol = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Image", "Metal", "Name", "Price", "Symbol", "Weight" },
                values: new object[,]
                {
                    { 1, "Rings", null, "22K Gold", "Royal Gold Ring", 32000m, "ring", 5.5m },
                    { 2, "Diamonds", null, "Diamond", "Solitaire Diamond Ring", 58000m, "ring", 4.2m },
                    { 3, "Necklaces", null, "22K Gold", "Bridal Necklace Set", 245000m, "necklace", 38m },
                    { 4, "Necklaces", null, "22K Gold", "Temple Design Haar", 168000m, "necklace", 25m },
                    { 5, "Earrings", null, "22K Gold", "Jhumka Earrings", 52000m, "earring", 8m },
                    { 6, "Diamonds", null, "Diamond", "Diamond Studs", 36000m, "diamond", 2.5m },
                    { 7, "Bangles", null, "22K Gold", "Classic Gold Bangles", 135000m, "bangle", 20m },
                    { 8, "Pendants", null, "22K Gold", "Gold Heart Pendant", 18500m, "pendant", 3.2m },
                    { 9, "Chains", null, "22K Gold", "Classic Gold Chain", 78000m, "necklace", 12m },
                    { 10, "Chains", null, "22K Gold", "Rope Design Chain", 118000m, "necklace", 18m },
                    { 11, "Mangalsutra", null, "22K Gold", "Traditional Mangalsutra", 98000m, "pendant", 16m },
                    { 12, "Mangalsutra", null, "Diamond", "Diamond Mangalsutra", 74000m, "pendant", 9m },
                    { 13, "Bracelets", null, "22K Gold", "Gold Link Bracelet", 92000m, "bangle", 14m },
                    { 14, "Bracelets", null, "22K Gold", "Charm Bracelet", 64000m, "bangle", 10m },
                    { 15, "Anklets", null, "Silver", "Silver Payal Pair", 5200m, "bangle", 45m },
                    { 16, "Anklets", null, "Silver", "Silver Anklet with Bells", 4400m, "bangle", 38m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
