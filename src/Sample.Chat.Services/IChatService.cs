using System.Threading;
using System.Threading.Tasks;

using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public interface IChatService
    {
        Task<int> AddUserToThreadAsync(AddUserToThreadRequestModel model, CancellationToken cancellationToken = default);
        Task<int> CreateThreadAsync(CreateThreadRequestModel model, CancellationToken cancellationToken = default);
        Task<bool> IsValidThread(string threadId, CancellationToken cancellationToken = default);
        Task<int> RemoveUserFromThreadAsync(RemoveUserFromThreadRequestModel model, CancellationToken cancellationToken = default);
        Task<string> SendMessageAsync(SendMessageRequestModel model, CancellationToken cancellationToken = default);

        Task<int> WithdrawFromAllThread(string email, CancellationToken cancellationToken = default);
    }
}