using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Data;

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
            return await _context.StoryParts
                .Include(sp => sp.Story) // Include related entities if needed
                .ToListAsync();
        }

        public async Task<StoryPart> GetStoryPartByIdAsync(int id)
        {
            return await _context.StoryParts
                .Include(sp => sp.Story) // Include related entities if needed
                .FirstOrDefaultAsync(sp => sp.PartId == id);
        }

        public async Task<StoryPart> AddStoryPartAsync(StoryPart storyPart)
        {
            _context.StoryParts.Add(storyPart);
            await _context.SaveChangesAsync();
            return storyPart;
        }

        public async Task UpdateStoryPartAsync(StoryPart storyPart)
        {
            _context.Entry(storyPart).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStoryPartAsync(int id)
        {
            var storyPart = await GetStoryPartByIdAsync(id);
            if (storyPart != null)
            {
                _context.StoryParts.Remove(storyPart);
                await _context.SaveChangesAsync();
            }
        }
    }
}
