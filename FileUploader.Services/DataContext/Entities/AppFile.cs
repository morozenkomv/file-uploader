using System;

namespace FileUploader.Services.DataContext.Entities
{
    public class AppFile: BaseEntity
    {
        public byte[] Content { get; set; }
        public string ContentType { get; set; }
        public string Name { get; set; }
        public long Size { get; set; }

        public string UploadBy { get; set; }
        public DateTime UploadDate { get; set; }
    }
}
