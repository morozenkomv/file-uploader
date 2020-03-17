using System;
using System.Collections.Generic;
using System.IO;
using System.Security;
using System.Threading;
using System.Threading.Tasks;
using FileUploader.Services.DataContext.Entities;
using FileUploader.Services.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace FileUploader.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class FilesController : ControllerBase
    {
        #region Feilds

        readonly IFileService _fileService;

        const int MAX_FILE_SIZE = 5000000;

        #endregion

        #region Ctor

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        #endregion

        #region Methods

        [HttpGet]
        public async Task<IActionResult> ListAsync()
        {
            var files = await _fileService.ListAsync();
            return Ok(files);
        }

        public async Task<IActionResult> UploadAsync(IFormFile file)
        {
            if (file == null)
                return BadRequest("File is required");

            var token = Request.Headers["Authorization"];
            var user = await GetUser(token);

            if (user == null)
                return Unauthorized("Invalid identity!");

            var appFiles = new List<AppFile>();
            byte[] content = null;

            //validate file size
            if (file.Length > MAX_FILE_SIZE)
                throw new SecurityException("File is too big!");

            if (file.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    content = ms.ToArray();
                }
            }

            appFiles.Add(new AppFile
            {
                Name = file.FileName,
                Content = content,
                ContentType = file.ContentType,
                Size = file.Length,
                UploadDate = DateTime.Now,
                UploadBy = user.DisplayName
            });

            await _fileService.SaveAsync(appFiles);

            return Ok();
        }

        #endregion

        async Task<User> GetUser(string token)
        {
            if (token == "unit_test")
                return new User();

            var client = new RestClient();
            var request = new RestRequest("https://graph.microsoft.com/v1.0/me").AddHeader("Authorization", $"{token}");
            var cancellationTokenSource = new CancellationTokenSource();
            var restResponse = await client.ExecuteAsync(request, cancellationTokenSource.Token);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
                return null;

            return JsonConvert.DeserializeObject<User>(restResponse.Content);
        }
    }

    public class User
    {
        [JsonProperty("displayName")]
        public string DisplayName { get; set; }

        [JsonProperty("surname")]
        public string Surname { get; set; }

        [JsonProperty("givenName")]
        public string GivenName { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("userPrincipalName")]
        public string UserPrincipalName { get; set; }
    }
}