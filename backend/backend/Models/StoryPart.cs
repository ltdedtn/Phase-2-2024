using backend.Models;
using System;

namespace backend.Models
{
    public class StoryPart
    {
        public int PartId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int StoryId { get; set; }
        public Story Story { get; set; }
        public int CharacterId { get; set; }
        public Character Character { get; set; }
    }
}
