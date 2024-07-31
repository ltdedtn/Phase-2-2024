﻿using System.Collections.Generic;

namespace backend.Models
{
    public class Character
    {
        public int CharacterId { get; set; }
        public string Name { get; set; } = string.Empty; // Ensure non-nullable
        public string? Description { get; set; } // Nullable
        public int? StoryId { get; set; } // Nullable
        public string? ImageUrl { get; set; } // Nullable

        public Story? Story { get; set; } // Nullable
        public ICollection<StoryPartCharacter> StoryPartCharacters { get; set; } = new List<StoryPartCharacter>();
    }
}
