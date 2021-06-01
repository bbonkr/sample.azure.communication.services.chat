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

        /// <summary>
        /// Get user info
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{email}")]
        [Produces(typeof(kr.bbon.AspNetCore.Models.ApiResponseModel<UserModel>))]
        public async Task<IActionResult> LoginAsync([FromRoute] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return StatusCode(HttpStatusCode.BadRequest, "Email address is invalid.");
            }

            var result = await userService.GetUserAsync(new GetUserRequestModel { Email = email });

            if (result == null)
            {
                return StatusCode(HttpStatusCode.NotFound, $"Could not find the user. ({email})");
            }

            return StatusCode(HttpStatusCode.OK, result);
        }

        /// <summary>
        /// Register user
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Produces(typeof(kr.bbon.AspNetCore.Models.ApiResponseModel<UserModel>))]
        public async Task<IActionResult> RegistAsync([FromBody] CreateUserRequestModel model)
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

        /// <summary>
        /// Unregister user
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{email}")]
        [Produces(typeof(kr.bbon.AspNetCore.Models.ApiResponseModel<bool>))]
        public async Task<IActionResult> UnregistAsync([FromRoute] string email)
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

            return StatusCode(HttpStatusCode.OK, "Done.", result > 0);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers(int page = 1, int limit = 10, string keyword = "")
        {
            var pageValue = page > 0 ? page : 1;
            var limitValue = limit > 0 ? limit : 10;

            var result = await userService.GetUsersAsync(pageValue, limitValue, keyword);

            return StatusCode(HttpStatusCode.OK, result);
        }

        private readonly IUserService userService;
        private readonly IChatService chatService;
    }
}
