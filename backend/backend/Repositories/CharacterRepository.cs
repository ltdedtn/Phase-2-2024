using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
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
            var characters = await _context.Characters
                .Include(c => c.StoryParts)
                .Include(c => c.Screenshots)
                .ToListAsync();

            // Handle null values in properties like ImageUrl
            characters.ForEach(c =>
            {
                c.ImageUrl ??= ""; // Set ImageUrl to empty string if null (C# 8.0 or later)
                // Add additional handling for other properties if needed
            });

            return characters;
        }

        public async Task<Character> GetCharacterByIdAsync(int id)
        {
            var character = await _context.Characters
                .Include(c => c.StoryParts)
                .Include(c => c.Screenshots)
                .FirstOrDefaultAsync(c => c.CharacterId == id);

            if (character != null)
            {
                // Handle null values in properties like ImageUrl
                character.ImageUrl ??= ""; // Set ImageUrl to empty string if null (C# 8.0 or later)
                // Add additional handling for other properties if needed
            }

            return character;
        }

        public async Task<Character> AddCharacterAsync(Character character)
        {
            _context.Characters.Add(character);
            await _context.SaveChangesAsync();
            return character;
        }

        public async Task<Character> UpdateCharacterAsync(Character character)
        {
            _context.Entry(character).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return character;
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
