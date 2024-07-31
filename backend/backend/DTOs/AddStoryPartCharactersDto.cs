// DTO for adding characters to a story part
public class AddStoryPartCharactersDto
{
    public int StoryPartId { get; set; }
    public List<int> CharacterIds { get; set; } = new List<int>();
}
