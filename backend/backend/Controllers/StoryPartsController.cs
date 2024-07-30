using backend.Data;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryPartsController : ControllerBase
    {
        private readonly BackendContext _context;
        private readonly CharacterRepository _characterRepository;

        public StoryPartsController(BackendContext context, CharacterRepository characterRepository)
        {
            _context = context;
            _characterRepository = characterRepository;
        }

        // Get all story parts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoryPart>>> GetStoryParts()
        {
            return await _context.StoryParts
                .Include(sp => sp.StoryPartCharacters)
                .ThenInclude(spc => spc.Character)
                .ToListAsync();
        }

        // Get a single story part by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<StoryPart>> GetStoryPart(int id)
        {
            var storyPart = await _context.StoryParts
                .Include(sp => sp.StoryPartCharacters)
                .ThenInclude(spc => spc.Character)
                .FirstOrDefaultAsync(sp => sp.PartId == id);

            if (storyPart == null)
            {
                return NotFound();
            }

            return Ok(storyPart);
        }

        // Get characters associated with a specific story part
        [HttpGet("{id}/characters")]
        public async Task<ActionResult<IEnumerable<Character>>> GetStoryPartCharacters(int id)
        {
            var storyPart = await _context.StoryParts
                .Include(sp => sp.StoryPartCharacters)
                .ThenInclude(spc => spc.Character)
                .FirstOrDefaultAsync(sp => sp.PartId == id);

            if (storyPart == null)
            {
                return NotFound();
            }

            var characters = storyPart.StoryPartCharacters.Select(spc => spc.Character);
            return Ok(characters);
        }

        // Add a new story part
        [HttpPost]
        public async Task<ActionResult<StoryPart>> PostStoryPart(StoryPart storyPart)
        {
            _context.StoryParts.Add(storyPart);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStoryPart), new { id = storyPart.PartId }, storyPart);
        }

        // Update an existing story part
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStoryPart(int id, StoryPart storyPart)
        {
            if (id != storyPart.PartId)
            {
                return BadRequest();
            }

            _context.Entry(storyPart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StoryPartExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Delete a story part
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStoryPart(int id)
        {
            var storyPart = await _context.StoryParts.FindAsync(id);
            if (storyPart == null)
            {
                return NotFound();
            }

            _context.StoryParts.Remove(storyPart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StoryPartExists(int id)
        {
            return _context.StoryParts.Any(e => e.PartId == id);
        }
    }
}
