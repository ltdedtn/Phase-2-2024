using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Story
    {
        public int StoryId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? UserId { get; set; }
        public string ImageUrl { get; set; }

        public User User { get; set; }
        public ICollection<Character> Characters { get; set; }
        public ICollection<StoryPart> StoryParts { get; set; }
    }
}
