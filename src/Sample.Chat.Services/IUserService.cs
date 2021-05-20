using System.Threading;
using System.Threading.Tasks;

using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public interface IUserService
    {
        Task<UserModel> CreateUserAsync(CreateUserRequestModel model, CancellationToken cancellationToken = default);
        Task<int> DeleteAsync(GetUserRequestModel model, CancellationToken cancellationToken = default);
        Task<UserModel> GetUserAsync(GetUserRequestModel model, CancellationToken cancellationToken = default);
        Task<UserModel> RefreshTokenAsync(GetUserRequestModel model, CancellationToken cancellationToken = default);
    }
}