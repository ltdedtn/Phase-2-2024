using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScreenshotsController : ControllerBase
    {
        private readonly IScreenshotRepository _screenshotRepository;

        public ScreenshotsController(IScreenshotRepository screenshotRepository)
        {
            _screenshotRepository = screenshotRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Screenshot>>> GetScreenshots()
        {
            return Ok(await _screenshotRepository.GetScreenshotsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Screenshot>> GetScreenshot(int id)
        {
            var screenshot = await _screenshotRepository.GetScreenshotByIdAsync(id);
            if (screenshot == null)
            {
                return NotFound();
            }
            return Ok(screenshot);
        }

        [HttpPost]
        public async Task<ActionResult<Screenshot>> PostScreenshot(Screenshot screenshot)
        {
            await _screenshotRepository.AddScreenshotAsync(screenshot);
            return CreatedAtAction(nameof(GetScreenshot), new { id = screenshot.ScreenshotId }, screenshot);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutScreenshot(int id, Screenshot screenshot)
        {
            if (id != screenshot.ScreenshotId)
            {
                return BadRequest();
            }

            await _screenshotRepository.UpdateScreenshotAsync(screenshot);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScreenshot(int id)
        {
            await _screenshotRepository.DeleteScreenshotAsync(id);
            return NoContent();
        }
    }
}
