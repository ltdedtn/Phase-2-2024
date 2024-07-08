using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryPartsController : ControllerBase
    {
        private readonly IStoryPartRepository _storyPartRepository;

        public StoryPartsController(IStoryPartRepository storyPartRepository)
        {
            _storyPartRepository = storyPartRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoryPart>>> GetStoryParts()
        {
            return Ok(await _storyPartRepository.GetStoryPartsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StoryPart>> GetStoryPart(int id)
        {
            var storyPart = await _storyPartRepository.GetStoryPartByIdAsync(id);
            if (storyPart == null)
            {
                return NotFound();
            }
            return Ok(storyPart);
        }

        [HttpPost]
        public async Task<ActionResult<StoryPart>> PostStoryPart(StoryPart storyPart)
        {
            await _storyPartRepository.AddStoryPartAsync(storyPart);
            return CreatedAtAction(nameof(GetStoryPart), new { id = storyPart.PartId }, storyPart);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutStoryPart(int id, StoryPart storyPart)
        {
            if (id != storyPart.PartId)
            {
                return BadRequest();
            }

            await _storyPartRepository.UpdateStoryPartAsync(storyPart);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStoryPart(int id)
        {
            await _storyPartRepository.DeleteStoryPartAsync(id);
            return NoContent();
        }
    }
}
