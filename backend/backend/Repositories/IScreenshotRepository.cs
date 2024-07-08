using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IScreenshotRepository
    {
        Task<IEnumerable<Screenshot>> GetScreenshotsAsync();
        Task<Screenshot> GetScreenshotByIdAsync(int id);
        Task<Screenshot> AddScreenshotAsync(Screenshot screenshot);
        Task<Screenshot> UpdateScreenshotAsync(Screenshot screenshot);
        Task DeleteScreenshotAsync(int id);
    }
}
