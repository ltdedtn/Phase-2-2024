namespace backend.DTOs
{
    public class StoryCreateDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int UserId { get; set; }
    }
}
