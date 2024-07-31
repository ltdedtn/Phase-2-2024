﻿using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Models;
using backend.Repositories; // Add the repository namespace
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryPartsController : ControllerBase
    {
        private readonly IStoryPartRepository _storyPartRepository; // Use repository

        public StoryPartsController(IStoryPartRepository storyPartRepository)
        {
            _storyPartRepository = storyPartRepository;
        }

        // Get all story parts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoryPart>>> GetStoryParts()
        {
            var storyParts = await _storyPartRepository.GetStoryPartsAsync();
            return Ok(storyParts);
        }

        // Get a single story part by ID
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

        // Add a new story part
        [HttpPost]
        public async Task<ActionResult<StoryPart>> PostStoryPart([FromForm] StoryPartCreateDto model, IFormFile? imageFile)
        {
            if (model == null || string.IsNullOrEmpty(model.Content) || model.StoryId <= 0)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                var storyPart = new StoryPart
                {
                    Content = model.Content,
                    StoryId = model.StoryId,
                    CreatedAt = DateTime.UtcNow,
                };

                if (imageFile != null && imageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine("wwwroot", "images", fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    storyPart.ImageUrl = "/images/" + fileName;
                }

                var createdStoryPart = await _storyPartRepository.AddStoryPartAsync(storyPart);
                return CreatedAtAction(nameof(GetStoryPart), new { id = createdStoryPart.PartId }, createdStoryPart);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error creating story part: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Update an existing story part
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStoryPart(int id, StoryPart storyPart)
        {
            if (id != storyPart.PartId)
            {
                return BadRequest();
            }

            try
            {
                await _storyPartRepository.UpdateStoryPartAsync(storyPart);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _storyPartRepository.StoryPartExistsAsync(id))
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
            await _storyPartRepository.DeleteStoryPartAsync(id);
            return NoContent();
        }

        // Add characters to a story part
        [HttpPost("AddCharacters")]
        public async Task<IActionResult> AddCharactersToStoryPart([FromBody] AddStoryPartCharactersDto dto)
        {
            if (dto == null || dto.StoryPartId <= 0 || dto.CharacterIds == null || !dto.CharacterIds.Any())
            {
                return BadRequest("Invalid data.");
            }

            var result = await _storyPartRepository.AddCharactersToStoryPartAsync(dto.StoryPartId, dto.CharacterIds);

            if (!result)
            {
                return NotFound("Story part not found.");
            }

            return Ok("Characters added to story part successfully.");
        }
        // Get story parts by story ID
        [HttpGet("ByStory/{storyId}")]
        public async Task<ActionResult<IEnumerable<StoryPart>>> GetStoryPartsByStoryId(int storyId)
        {
            var storyParts = await _storyPartRepository.GetStoryPartsByStoryIdAsync(storyId);

            if (storyParts == null || !storyParts.Any())
            {
                return Ok(new List<StoryPart>()); // Return an empty list if no story parts found
            }

            return Ok(storyParts);
        }




    }
}
