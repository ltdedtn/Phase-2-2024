using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            return Ok(await _characterRepository.GetCharactersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Character>> GetCharacter(int id)
        {
            var character = await _characterRepository.GetCharacterByIdAsync(id);
            if (character == null)
            {
                return NotFound();
            }
            return Ok(character);
        }
        [HttpPost]
        public async Task<ActionResult<Character>> PostCharacter([FromForm] CharacterCreate model)
        {
            try
            {
                var character = new Character
                {
                    Name = model.Name,
                    Description = model.Description,
                    StoryId = model.StoryId,
                    // Populate other fields as needed
                };

                if (model.ImageFile != null && model.ImageFile.Length > 0)
                {
                    // Generate a unique file name or use GUID
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ImageFile.FileName);
                    var filePath = Path.Combine("wwwroot", "images", fileName); // Example: Save to wwwroot/images folder

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.ImageFile.CopyToAsync(fileStream);
                    }

                    character.ImageUrl = "/images/" + fileName; // Store relative URL in database
                }

                await _characterRepository.AddCharacterAsync(character);

                return CreatedAtAction(nameof(GetCharacter), new { id = character.CharacterId }, character);
            }
            catch (Exception ex)
            {
                // Log the exception for detailed debugging
                Console.WriteLine($"Error creating character: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutCharacter(int id, Character character)
        {
            if (id != character.CharacterId)
            {
                return BadRequest();
            }

            await _characterRepository.UpdateCharacterAsync(character);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCharacter(int id)
        {
            await _characterRepository.DeleteCharacterAsync(id);
            return NoContent();
        }
    }
}
