using backend.Models;
using System.Collections.Generic;
using System.Linq;
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
                .Include(sp => sp.Story)
                .Include(sp => sp.StoryPartCharacters)
                .ToListAsync();
        }

        public async Task<StoryPart> GetStoryPartByIdAsync(int id)
        {
            return await _context.StoryParts
                .Include(sp => sp.Story)
                .Include(sp => sp.StoryPartCharacters)
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
            var storyPart = await _context.StoryParts
                .Include(sp => sp.StoryPartCharacters)
                .FirstOrDefaultAsync(sp => sp.PartId == id);

            if (storyPart == null) return;

            _context.StoryPartCharacters.RemoveRange(storyPart.StoryPartCharacters);
            _context.StoryParts.Remove(storyPart);

            await _context.SaveChangesAsync();
        }

        public async Task<bool> AddCharactersToStoryPartAsync(int storyPartId, IEnumerable<int> characterIds)
        {
            var storyPart = await _context.StoryParts
                .Include(sp => sp.StoryPartCharacters)
                .FirstOrDefaultAsync(sp => sp.PartId == storyPartId);

            if (storyPart == null)
            {
                return false;
            }

            var existingCharacterIds = storyPart.StoryPartCharacters.Select(spc => spc.CharacterId).ToList();
            var newCharacterIds = characterIds.Except(existingCharacterIds).ToList();

            var newStoryPartCharacters = newCharacterIds.Select(characterId => new StoryPartCharacter
            {
                StoryPartId = storyPartId,
                CharacterId = characterId
            }).ToList();

            _context.StoryPartCharacters.AddRange(newStoryPartCharacters);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> StoryPartExistsAsync(int id)
        {
            return await _context.StoryParts.AnyAsync(e => e.PartId == id);
        }

        public async Task<IEnumerable<StoryPart>> GetStoryPartsByStoryIdAsync(int storyId)
        {
            return await _context.StoryParts
                .Where(sp => sp.StoryId == storyId)
                .ToListAsync();
        }

        public async Task<IEnumerable<StoryPart>> GetStoryPartsByCharacterIdAsync(int characterId) // Add this method
        {
            return await _context.StoryParts
                .Where(sp => sp.StoryPartCharacters.Any(spc => spc.CharacterId == characterId))
                .ToListAsync();
        }
    }
}
