using Microsoft.EntityFrameworkCore;
using PimbaPetAPI.Models;
using PimbaPetAPI.Objects.Models;

namespace PimbaPetAPI.data
{
    public class PetShopDBContext : DbContext
    {
        public PetShopDBContext(DbContextOptions<PetShopDBContext> options)
        : base(options) { }

        public DbSet<DonoModel> Donos { get; set; }
        public DbSet<PetModel> Pets { get; set; }
        public DbSet<UserModel> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationship between Pet and Dono with cascade delete
            modelBuilder.Entity<PetModel>()
                .HasOne<DonoModel>()
                .WithMany()
                .HasForeignKey(p => p.Dono_id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}