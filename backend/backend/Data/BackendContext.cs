using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class BackendContext : DbContext
    {
        public BackendContext(DbContextOptions<BackendContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<Screenshot> Screenshots { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<StoryPart> StoryParts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId);
                entity.Property(u => u.Username).IsRequired();
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Email).IsRequired();
                entity.Property(u => u.CreatedAt).IsRequired();
            });

            modelBuilder.Entity<Story>(entity =>
            {
                entity.HasKey(s => s.StoryId);
                entity.Property(s => s.Title).IsRequired();
                entity.Property(s => s.Description).IsRequired(false); // Optional description
                entity.Property(s => s.CreatedAt).IsRequired();

                // Define relationship with User
                entity.HasOne(s => s.User)
                    .WithMany(u => u.Stories)
                    .HasForeignKey(s => s.UserId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade); // or Restrict based on your requirements
            });

            modelBuilder.Entity<Screenshot>(entity =>
            {
                entity.HasKey(sc => sc.ScreenshotId);
                entity.Property(sc => sc.ImagePath).IsRequired();

                // Define relationship with Story and Character
                entity.HasOne(sc => sc.Story)
                    .WithMany(s => s.Screenshots)
                    .HasForeignKey(sc => sc.StoryId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade); // or Restrict based on your requirements

                entity.HasOne(sc => sc.Character)
                    .WithMany(c => c.Screenshots)
                    .HasForeignKey(sc => sc.CharacterId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.Restrict); // CharacterId is optional
            });

            modelBuilder.Entity<Character>(entity =>
            {
                entity.HasKey(c => c.CharacterId);
                entity.Property(c => c.Name).IsRequired();
                entity.Property(c => c.Description).IsRequired(false); // Optional description
                entity.Property(c => c.ImageUrl).IsRequired(false); // Optional ImageUrl

                // Define relationship with Story
                entity.HasOne(c => c.Story)
                    .WithMany(s => s.Characters)
                    .HasForeignKey(c => c.StoryId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade); // or Restrict based on your requirements
            });

            modelBuilder.Entity<StoryPart>(entity =>
            {
                entity.HasKey(sp => sp.PartId);
                entity.Property(sp => sp.Content).IsRequired();
                entity.Property(sp => sp.CreatedAt).IsRequired();

                // Define relationships with Story and Character
                entity.HasOne(sp => sp.Story)
                    .WithMany(s => s.StoryParts)
                    .HasForeignKey(sp => sp.StoryId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(sp => sp.Character)
                    .WithMany(c => c.StoryParts)
                    .HasForeignKey(sp => sp.CharacterId) // Ensure correct mapping
                    .IsRequired(false) // CharacterId is optional
                    .OnDelete(DeleteBehavior.Restrict); // or Cascade based on your requirements
            });

            // Indexes can be configured if needed
            modelBuilder.Entity<Screenshot>()
                .HasIndex(sc => sc.StoryId);

            modelBuilder.Entity<Screenshot>()
                .HasIndex(sc => sc.CharacterId);

            modelBuilder.Entity<Character>()
                .HasIndex(c => c.StoryId);

            modelBuilder.Entity<StoryPart>()
                .HasIndex(sp => new { sp.StoryId, sp.CharacterId }); // Composite index example
        }
    }
}
