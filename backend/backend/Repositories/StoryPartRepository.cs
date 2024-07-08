using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class StoryPartRepository : IStoryPartRepository
    {
        private readonly BackendContext _context;

        public StoryPartRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StoryPart>> GetStoryPartsAsync()
        {
            return await _context.StoryParts.ToListAsync();
        }

        public async Task<StoryPart> GetStoryPartByIdAsync(int id)
        {
            return await _context.StoryParts.FindAsync(id);
        }

        public async Task<StoryPart> AddStoryPartAsync(StoryPart storyPart)
        {
            _context.StoryParts.Add(storyPart);
            await _context.SaveChangesAsync();
            return storyPart;
        }

        public async Task<StoryPart> UpdateStoryPartAsync(StoryPart storyPart)
        {
            _context.Entry(storyPart).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return storyPart;
        }

        public async Task DeleteStoryPartAsync(int id)
        {
            var storyPart = await _context.StoryParts.FindAsync(id);
            _context.StoryParts.Remove(storyPart);
            await _context.SaveChangesAsync();
        }
    }
}
