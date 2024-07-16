namespace backend.Models
{
    public class Screenshot
    {
        public int ScreenshotId { get; set; }
        public string ImagePath { get; set; }
        public int? StoryId { get; set; }
        public Story Story { get; set; }
        public int? CharacterId { get; set; } 
        public Character Character { get; set; } 
    }
}
