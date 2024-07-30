using System.Collections.Generic;

namespace backend.DTOs
{
    public class StoryPartCreateDto
    {
        public string Content { get; set; }
        public int StoryId { get; set; }
        public List<int> CharacterIds { get; set; } = new List<int>(); // Adjusted to handle list of CharacterIds
    }
}
