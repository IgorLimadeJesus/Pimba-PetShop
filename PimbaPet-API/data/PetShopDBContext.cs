using Microsoft.EntityFrameworkCore;
using PimbaPetAPI.Models;

namespace PimbaPetAPI.data
{
    public class PetShopDBContext : DbContext
    {
        public PetShopDBContext(DbContextOptions<PetShopDBContext> options)
        : base(options) { }

        public DbSet<DonoModel> Donos { get; set; }
        public DbSet<PetModel> Pets { get; set; }

    }
}