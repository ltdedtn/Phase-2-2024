using backend.Models;

public class StoryPart
{
    public int PartId { get; set; }
    public string Content { get; set; }
    public int StoryId { get; set; }
    public int CharacterId { get; set; }
    public DateTime CreatedAt { get; set; }

    public virtual Character Character { get; set; }
    public virtual Story Story { get; set; }
}
