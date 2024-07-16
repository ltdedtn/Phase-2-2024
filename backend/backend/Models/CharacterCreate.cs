using Microsoft.AspNetCore.Http;

namespace backend.Models
{
    public class CharacterCreate
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int StoryId { get; set; }
        public IFormFile ImageFile { get; set; }
    }
}
