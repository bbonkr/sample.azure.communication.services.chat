using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using kr.bbon.AspNetCore.Mvc;
using kr.bbon.AspNetCore.Filters;

using Microsoft.AspNetCore.Mvc;
using kr.bbon.AspNetCore;
using Sample.Chat.Services;
using System.Net;
using Sample.Chat.Services.Models;

namespace Sample.Chat.Controllers
{
    [ApiController]
    [ApiExceptionHandlerFilter]
    [Area(DefaultValues.AreaName)]
    [Route(DefaultValues.RouteTemplate)]
    [ApiVersion("1.0")]
    public class UsersController : ApiControllerBase
    {
        public UsersController(
            IUserService userService,
            IChatService chatService)
        {
            this.userService = userService;
            this.chatService = chatService;
        }

        [HttpGet]
        [Route("{email}")]
        public async Task<IActionResult> LoginAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return StatusCode(HttpStatusCode.BadRequest, "Email address is invalid.");
            }

            var result = await userService.GetUserAsync(new GetUserRequestModel { Email = email });

            return StatusCode(HttpStatusCode.OK, result);
        }

        [HttpPost]
        public async Task<IActionResult> RegistAsync(CreateUserRequestModel model)
        {
            model.Email = model.Email?.Trim();
            model.DisplayName = model.DisplayName?.Trim();

            if (string.IsNullOrWhiteSpace(model.Email))
            {
                return StatusCode(HttpStatusCode.BadRequest, "Email address is invalid.");
            }

            if (string.IsNullOrWhiteSpace(model.DisplayName))
            {
                return StatusCode(HttpStatusCode.BadRequest, "Display name is invalid.");
            }

            var result = await userService.CreateUserAsync(model);

            return StatusCode(HttpStatusCode.Created, result);
        }

        [HttpDelete]
        [Route("{email}")]
        public async Task<IActionResult> UnregistAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return StatusCode(HttpStatusCode.BadRequest, "Email address is invalid.");
            }

            // Withdraw from all thread.
            await chatService.WithdrawFromAllThread(email);

            var result = await userService.DeleteAsync(new GetUserRequestModel
            {
                Email = email,
            });

            if (result == 0)
            {
                return StatusCode(HttpStatusCode.BadRequest, "Email address is invalid.");
            }

            return StatusCode(HttpStatusCode.OK, "Done.");
        }


        private readonly IUserService userService;
        private readonly IChatService chatService;
    }
}
