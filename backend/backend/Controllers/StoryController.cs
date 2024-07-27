using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryController : ControllerBase
    {
        private readonly BackendContext _context;

        public StoryController(BackendContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Story>>> GetStories()
        {
            return await _context.Stories
                
                .Include(s => s.Screenshots)
                .Include(s => s.StoryParts)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Story>> GetStory(int id)
        {
            var story = await _context.Stories
                .Include(s => s.Characters)
                .Include(s => s.Screenshots)
                .Include(s => s.StoryParts)
                .FirstOrDefaultAsync(s => s.StoryId == id);

            if (story == null)
            {
                return NotFound();
            }

            return story;
        }

        [HttpPost]
        public async Task<ActionResult<Story>> PostStory(Story story)
        {
            _context.Stories.Add(story);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStory), new { id = story.StoryId }, story);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutStory(int id, Story story)
        {
            if (id != story.StoryId)
            {
                return BadRequest();
            }

            _context.Entry(story).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StoryExists(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStory(int id)
        {
            var story = await _context.Stories.FindAsync(id);
            if (story == null)
            {
                return NotFound();
            }

            _context.Stories.Remove(story);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StoryExists(int id)
        {
            return _context.Stories.Any(e => e.StoryId == id);
        }
    }
}
