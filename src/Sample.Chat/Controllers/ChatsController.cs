
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
using kr.bbon.AspNetCore.Models;
using kr.bbon.EntityFrameworkCore.Extensions;
using Azure.Communication.Chat;

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

        /// <summary>
        /// Get threads
        /// </summary>
        /// <param name="email"></param>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="keyword"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{email}/threads")]
        [Produces(typeof(ApiResponseModel<IPagedModel<ThreadResponseModel>>))]
        public async Task<IActionResult> GetThreads([FromRoute] string email, [FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string keyword = "")
        {
            var threads = await chatService.GetParticipatedThread(email, page, limit, keyword);

            return StatusCode(HttpStatusCode.OK, threads);
        }

        /// <summary>
        /// Create thread
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("threads")]
        [Produces(typeof(ApiResponseModel<CreateThreadResponseModel>))]
        public async Task<IActionResult> CreateThreadAsync([FromBody] CreateThreadRequestModel model)
        {
            var result = await chatService.CreateThreadAsync(model);

            return StatusCode(HttpStatusCode.Created, result);
        }

        /// <summary>
        /// Join to thread
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPatch]
        [Route("threads/{threadId}/join")]
        [Produces(typeof(ApiResponseModel<ThreadResponseModel>))]
        public async Task<IActionResult> ParticipateAsync([FromRoute] string threadId, [FromBody] AddUserToThreadRequestModel model)
        {
            var result = await chatService.AddUserToThreadAsync(model);

            if (result == null)
            {
                return StatusCode(HttpStatusCode.NotFound, $"could not find the thread ({threadId})");
            }

            return StatusCode(HttpStatusCode.OK, result);
        }

        /// <summary>
        /// Leave from thread
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPatch]
        [Route("threads/{threadId}/leave")]
        [Produces(typeof(ApiResponseModel<ThreadResponseModel>))]
        public async Task<IActionResult> LeaveAsync([FromRoute] string threadId, [FromBody] RemoveUserFromThreadRequestModel model)
        {
            var result = await chatService.RemoveUserFromThreadAsync(model);

            if (result == null)
            {
                return StatusCode(HttpStatusCode.NotFound, $"could not find the thread ({threadId})");
            }

            return StatusCode(HttpStatusCode.OK, result);
        }

        /// <summary>
        /// Delete the thread
        /// </summary>
        /// <param name="threadId"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("thread/{threadId}")]
        [Produces(typeof(ApiResponseModel<string>))]
        public async Task<IActionResult> DeleteThread([FromRoute] string threadId)
        {
            var result = await chatService.DeleteThreadAsync(new DeleteThreadRequest
            {
                ThreadId = threadId,
                Force = false,
            });

            if (result == 0)
            {
                return StatusCode(HttpStatusCode.NotFound, $"could not find the thread ({threadId})");
            }

            return StatusCode(HttpStatusCode.OK, threadId);
        }

        /// <summary>
        /// Send message to thread
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("threads/{threadId}/messages")]
        [Produces(typeof(ApiResponseModel<IEnumerable<ChatMessageModel>>))]
        public async Task<IActionResult> SendMessageAsync([FromRoute] string threadId, [FromBody] SendMessageRequestModel model)
        {
            var result = await chatService.SendMessageAsync(model);

            return StatusCode(HttpStatusCode.OK, string.Empty, new List<ChatMessageModel> { result });
        }

        /// <summary>
        /// Send file to thread
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("threads/{threadId}/files")]
        [Produces(typeof(ApiResponseModel<IEnumerable<ChatMessageModel>>))]
        public async Task<IActionResult> SendFileAsync([FromRoute] string threadId, [FromForm] SendFileRequestModel model, CancellationToken cancellationToken = default)
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

            var messages = new List<ChatMessageModel>();
            foreach (var response in savedResponse)
            {
                var message = await chatService.SendMessageAsync(new SendMessageRequestModel
                {
                    ThreadId = model.ThreadId,
                    SenderId = model.senderId,
                    Content = response.Html,
                    ContentType = ChatContentType.Html,

                });

                messages.Add(message);
            }

            return StatusCode(HttpStatusCode.OK, messages);
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
