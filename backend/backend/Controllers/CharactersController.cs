using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CharactersController : ControllerBase
    {
        private readonly ICharacterRepository _characterRepository;

        public CharactersController(ICharacterRepository characterRepository)
        {
            _characterRepository = characterRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
        {
            var characters = await _characterRepository.GetCharactersAsync();
            return Ok(characters);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Character>> GetCharacterById(int id)
        {
            var character = await _characterRepository.GetCharacterByIdAsync(id);
            if (character == null)
            {
                return NotFound();
            }
            return Ok(character);
        }

        [HttpPost]
        public async Task<ActionResult> AddCharacter(Character character)
        {
            await _characterRepository.AddCharacterAsync(character);
            return CreatedAtAction(nameof(GetCharacterById), new { id = character.CharacterId }, character);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCharacter(int id, Character character)
        {
            if (id != character.CharacterId)
            {
                return BadRequest();
            }

            await _characterRepository.UpdateCharacterAsync(character);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCharacter(int id)
        {
            await _characterRepository.DeleteCharacterAsync(id);
            return NoContent();
        }
    }
}
