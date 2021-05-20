
using kr.bbon.AspNetCore.Mvc;
using kr.bbon.AspNetCore.Filters;

using Microsoft.AspNetCore.Mvc;
using kr.bbon.AspNetCore;
using Sample.Chat.Services;
using System.Threading.Tasks;
using System.Net;
using Sample.Chat.Services.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading;

namespace Sample.Chat.Controllers
{
    [ApiController]
    [ApiExceptionHandlerFilter]
    [Area(DefaultValues.AreaName)]
    [Route(DefaultValues.RouteTemplate)]
    [ApiVersion("1.0")]
    public class ChatsController : ApiControllerBase
    {
        public ChatsController(
            IChatService chatService,
            IFileService fileService)
        {
            this.chatService = chatService;
            this.fileService = fileService;
        }

        [HttpGet]
        [Route("{email}")]
        public async Task<IActionResult> GetThreads([FromRoute] string email, [FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string keyword = "")
        {
            var threads = await chatService.GetParticipatedThread(email, page, limit, keyword);

            return StatusCode(HttpStatusCode.OK, threads);
        }

        [HttpPost]
        [Route("threads")]
        public async Task<IActionResult> CreateThreadAsync([FromBody] CreateThreadRequestModel model)
        {
            var result = await chatService.CreateThreadAsync(model);

            return StatusCode(HttpStatusCode.Created, result);
        }

        [HttpPatch]
        [Route("threads/{id}")]
        public async Task<IActionResult> ParticipateAsync([FromRoute] string id, [FromBody] AddUserToThreadRequestModel model)
        {
            var result = await chatService.AddUserToThreadAsync(model);

            return StatusCode(HttpStatusCode.OK);
        }

        [HttpDelete]
        [Route("threads/{id}")]
        public async Task<IActionResult> LeaveAsync([FromRoute] string id, [FromBody] RemoveUserFromThreadRequestModel model)
        {
            var result = await chatService.RemoveUserFromThreadAsync(model);

            return StatusCode(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("threads/{id}/messages")]
        public async Task<IActionResult> SendMessageAsync([FromRoute] string id, [FromBody] SendMessageRequestModel model)
        {
            var result = await chatService.SendMessageAsync(model);

            return StatusCode(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("thread/{id}/files")]
        public async Task<IActionResult> SendFileAsync([FromRoute] string id, [FromBody] SendFileRequestModel model, CancellationToken cancellationToken = default)
        {
            var requests = new List<FileSavedRequestModel>();

            foreach (var file in model.Files)
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream, cancellationToken);

                    requests.Add(new FileSavedRequestModel
                    {
                        Content = stream.ToArray(),
                        ContentType = file.ContentType,
                        FileName = file.FileName,
                    });
                }
            }

            var savedResponse = await fileService.SaveAsync(requests, cancellationToken);

            foreach (var response in savedResponse)
            {
                await chatService.SendMessageAsync(new SendMessageRequestModel
                {
                    ThreadId = model.ThreadId,
                    SenderId = model.senderId,
                    Content = response.Html,
                    ContentType = ChatContentType.Html,

                });
            }

            return StatusCode(HttpStatusCode.OK);
        }


        private readonly IChatService chatService;
        private readonly IFileService fileService;

    }

    public class SendFileRequestModel
    {
        public string ThreadId { get; set; }
        public string senderId { get; set; }

        public IList<IFormFile> Files { get; set; }
    }
}
