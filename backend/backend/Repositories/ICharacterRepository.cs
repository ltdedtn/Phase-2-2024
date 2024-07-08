using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface ICharacterRepository
    {
        Task<IEnumerable<Character>> GetCharactersAsync();
        Task<Character> GetCharacterByIdAsync(int id);
        Task<Character> AddCharacterAsync(Character character);
        Task<Character> UpdateCharacterAsync(Character character);
        Task DeleteCharacterAsync(int id);
    }
}
