using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IStoryPartRepository
    {
        Task<IEnumerable<StoryPart>> GetStoryPartsAsync();
        Task<StoryPart> GetStoryPartByIdAsync(int id);
        Task<StoryPart> AddStoryPartAsync(StoryPart storyPart);
        Task UpdateStoryPartAsync(StoryPart storyPart);
        Task DeleteStoryPartAsync(int id);
    }
}
