using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using kr.bbon.EntityFrameworkCore.Extensions;

using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public interface IUserService
    {
        Task<IPagedModel<UserModel>> GetUsersAsync(int page =1, int limit = 10, string keyword = "", CancellationToken cancellationToken =default);

        Task<UserModel> CreateUserAsync(CreateUserRequestModel model, CancellationToken cancellationToken = default);
        Task<int> DeleteAsync(GetUserRequestModel model, CancellationToken cancellationToken = default);
        Task<UserModel> GetUserAsync(GetUserRequestModel model, CancellationToken cancellationToken = default);
        Task<UserModel> RefreshTokenAsync(GetUserRequestModel model, CancellationToken cancellationToken = default);
    }
}