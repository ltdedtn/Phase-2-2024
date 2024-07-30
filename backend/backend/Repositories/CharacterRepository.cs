using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class CharacterRepository : ICharacterRepository
    {
        private readonly BackendContext _context;

        public CharacterRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Character>> GetCharactersAsync()
        {
            return await _context.Characters
                .Include(c => c.StoryPartCharacters)
                .ThenInclude(spc => spc.StoryPart)
                .ToListAsync();
        }

        public async Task<Character> GetCharacterByIdAsync(int id)
        {
            return await _context.Characters
                .Include(c => c.StoryPartCharacters)
                .ThenInclude(spc => spc.StoryPart)
                .FirstOrDefaultAsync(c => c.CharacterId == id);
        }

        public async Task AddCharacterAsync(Character character)
        {
            await _context.Characters.AddAsync(character);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCharacterAsync(Character character)
        {
            _context.Characters.Update(character);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCharacterAsync(int id)
        {
            var character = await _context.Characters.FindAsync(id);
            if (character != null)
            {
                _context.Characters.Remove(character);
                await _context.SaveChangesAsync();
            }
        }
    }
}
