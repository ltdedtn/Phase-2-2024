using backend.Models;
using Microsoft.EntityFrameworkCore;


namespace backend.Data
{
    public class backendContext : DbContext
    {
        public backendContext(DbContextOptions<backendContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<Screenshot> Screenshots { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<StoryPart> StoryParts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Stories)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<Story>()
                .HasMany(s => s.Screenshots)
                .WithOne(sc => sc.Story)
                .HasForeignKey(sc => sc.StoryId);

            modelBuilder.Entity<Story>()
                .HasMany(s => s.Characters)
                .WithOne(c => c.Story)
                .HasForeignKey(c => c.StoryId);

            modelBuilder.Entity<Story>()
                .HasMany(s => s.StoryParts)
                .WithOne(sp => sp.Story)
                .HasForeignKey(sp => sp.StoryId);

            modelBuilder.Entity<Character>()
                .HasMany(c => c.StoryParts)
                .WithOne(sp => sp.Character)
                .HasForeignKey(sp => sp.CharacterId);
        }
    }
}
