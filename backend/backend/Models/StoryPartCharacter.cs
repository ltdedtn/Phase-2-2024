namespace backend.Models
{
    public class StoryPartCharacter
    {
        public int StoryPartId { get; set; }
        public int CharacterId { get; set; }

        public StoryPart StoryPart { get; set; }
        public Character Character { get; set; }
    }
}
