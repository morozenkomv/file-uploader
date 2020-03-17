using FileUploader.Services.DataContext;
using FileUploader.Services.DataContext.Entities;
using FileUploader.Services.Services;
using FileUploader.Web.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security;
using System.Threading.Tasks;

namespace FileUploader.Tests
{
    public class Tests
    {
        readonly IFileService _fileService;
        readonly FilesController _filesController;

        public Tests()
        {
            var options = new DbContextOptionsBuilder<Context>()
                  .UseInMemoryDatabase(Guid.NewGuid().ToString())
                  .Options;

            var context = new Context(options);
            _fileService = new FileService(context);

            _filesController = new FilesController(_fileService);
        }

        [Test]
        public async Task ListTest()
        {
            var appFiles = new List<AppFile>();

            appFiles.Add(new AppFile
            {
                Name = "Test file 1",
                Content = new byte[30],
                ContentType = "apapapa",
                Size = 30000,
                UploadDate = DateTime.Now,
                UploadBy = "Test user"
            });

            appFiles.Add(new AppFile
            {
                Name = "Test file 2",
                Content = new byte[30],
                ContentType = "apapapa",
                Size = 30000,
                UploadDate = DateTime.Now,
                UploadBy = "Test user"
            });

            appFiles.Add(new AppFile
            {
                Name = "Test file 3",
                Content = new byte[30],
                ContentType = "apapapa",
                Size = 30000,
                UploadDate = DateTime.Now,
                UploadBy = "Test user"
            });

            await _fileService.SaveAsync(appFiles);

            var files = await _fileService.ListAsync();
            NUnit.Framework.Assert.AreEqual(3, files.Count);
        }

        [Test]
        public void FileSizeValidationFailTest()
        {
            var fileMock = GetFileMock(6000000);

            _filesController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _filesController.ControllerContext.HttpContext.Request.Headers["Authorization"] = "unit_test";

            NUnit.Framework.Assert.ThrowsAsync<SecurityException>(() => _filesController.UploadAsync(fileMock.Object));
        }

        #region Private

        private Mock<IFormFile> GetFileMock(int size)
        {
            var fileMock = new Mock<IFormFile>();
            var content = "Hello World from a Fake File";
            var fileName = "test.png";
            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);
            writer.Write(content);
            writer.Flush();
            ms.Position = 0;
            fileMock.Setup(_ => _.OpenReadStream()).Returns(ms);
            fileMock.Setup(_ => _.FileName).Returns(fileName);
            fileMock.Setup(_ => _.Length).Returns(size);

            return fileMock;
        }

        #endregion
    }
}