using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryController : ControllerBase
    {
        private readonly IStoryRepository _storyRepository;

        public StoryController(IStoryRepository storyRepository)
        {
            _storyRepository = storyRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Story>>> GetStories()
        {
            return Ok(await _storyRepository.GetStoriesAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Story>> GetStory(int id)
        {
            var story = await _storyRepository.GetStoryByIdAsync(id);
            if (story == null)
            {
                return NotFound();
            }
            return Ok(story);
        }

        [HttpPost]
        public async Task<ActionResult<Story>> PostStory(StoryCreateDto storyDto)
        {
            var story = new Story
            {
                Title = storyDto.Title,
                Description = storyDto.Description,
                ImageUrl = storyDto.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                UserId = storyDto.UserId
            };

            var createdStory = await _storyRepository.AddStoryAsync(story);
            return CreatedAtAction(nameof(GetStory), new { id = createdStory.StoryId }, createdStory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutStory(int id, StoryUpdateDto storyDto)
        {
            if (id != storyDto.StoryId)
            {
                return BadRequest("Story ID mismatch");
            }

            var story = await _storyRepository.GetStoryByIdAsync(id);
            if (story == null)
            {
                return NotFound();
            }

            story.Title = storyDto.Title;
            story.Description = storyDto.Description;
            story.ImageUrl = storyDto.ImageUrl;

            await _storyRepository.UpdateStoryAsync(story);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStory(int id)
        {
            var story = await _storyRepository.GetStoryByIdAsync(id);
            if (story == null)
            {
                return NotFound();
            }

            await _storyRepository.DeleteStoryAsync(id);
            return NoContent();
        }
    }
}
