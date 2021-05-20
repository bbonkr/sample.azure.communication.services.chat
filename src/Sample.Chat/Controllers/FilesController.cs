
using kr.bbon.AspNetCore.Mvc;
using kr.bbon.AspNetCore.Filters;

using Microsoft.AspNetCore.Mvc;
using kr.bbon.AspNetCore;
using System;
using Sample.Chat.Services;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;

namespace Sample.Chat.Controllers
{
    [ApiController]
    [ApiExceptionHandlerFilter]
    [Area(DefaultValues.AreaName)]
    [Route(DefaultValues.RouteTemplate)]
    [ApiVersion("1.0")]
    public class FilesController : ApiControllerBase
    {
        public FilesController(
            IFileService fileService)
        {
            this.fileService = fileService;
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetFileAsync(Guid id)
        {
            var response = await fileService.GetFileContentAsync(id);

            return File(response.Content, response.ContentType, response.FileName);
        }

        private readonly IFileService fileService;

    }
}
