using backend.Models;
using System.Collections.Generic;

namespace backend.Models
{
    public class Character
    {
        public int CharacterId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int StoryId { get; set; }
        public Story Story { get; set; }

        public ICollection<StoryPart> StoryParts { get; set; }
    }
}
