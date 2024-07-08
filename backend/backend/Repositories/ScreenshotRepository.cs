using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class ScreenshotRepository : IScreenshotRepository
    {
        private readonly BackendContext _context;

        public ScreenshotRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Screenshot>> GetScreenshotsAsync()
        {
            return await _context.Screenshots.ToListAsync();
        }

        public async Task<Screenshot> GetScreenshotByIdAsync(int id)
        {
            return await _context.Screenshots.FindAsync(id);
        }

        public async Task<Screenshot> AddScreenshotAsync(Screenshot screenshot)
        {
            _context.Screenshots.Add(screenshot);
            await _context.SaveChangesAsync();
            return screenshot;
        }

        public async Task<Screenshot> UpdateScreenshotAsync(Screenshot screenshot)
        {
            _context.Entry(screenshot).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return screenshot;
        }

        public async Task DeleteScreenshotAsync(int id)
        {
            var screenshot = await _context.Screenshots.FindAsync(id);
            _context.Screenshots.Remove(screenshot);
            await _context.SaveChangesAsync();
        }
    }
}
