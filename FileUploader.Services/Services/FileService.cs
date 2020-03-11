using FileUploader.Services.DataContext;
using FileUploader.Services.DataContext.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FileUploader.Services.Services
{
    public class FileService : IFileService
    {
        readonly Context _context;

        public FileService(Context context)
        {
            _context = context;
        }

        public Task<List<AppFile>> ListAsync() => _context.Files.ToListAsync();

        public Task SaveAsync(List<AppFile> files)
        {
            _context.AddRange(files);
            return _context.SaveChangesAsync();
        }
    }

    public interface IFileService
    {
        Task SaveAsync(List<AppFile> files);
        Task<List<AppFile>> ListAsync();
    }
}
