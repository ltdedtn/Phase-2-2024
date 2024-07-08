using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class StoryRepository : IStoryRepository
    {
        private readonly BackendContext _context;

        public StoryRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Story>> GetStoriesAsync()
        {
            return await _context.Stories.ToListAsync();
        }

        public async Task<Story> GetStoryByIdAsync(int id)
        {
            return await _context.Stories.FindAsync(id);
        }

        public async Task<Story> AddStoryAsync(Story story)
        {
            _context.Stories.Add(story);
            await _context.SaveChangesAsync();
            return story;
        }

        public async Task<Story> UpdateStoryAsync(Story story)
        {
            _context.Entry(story).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return story;
        }

        public async Task DeleteStoryAsync(int id)
        {
            var story = await _context.Stories.FindAsync(id);
            _context.Stories.Remove(story);
            await _context.SaveChangesAsync();
        }
    }
}
