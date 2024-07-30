using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class StoryPart
    {
        public int PartId { get; set; } // This should be the primary key
        public string Content { get; set; }
        public int StoryId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ImageUrl { get; set; }

        public Story Story { get; set; }
        public ICollection<StoryPartCharacter> StoryPartCharacters { get; set; }
    }
}
