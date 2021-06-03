using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using Azure.Communication.Chat;

using kr.bbon.EntityFrameworkCore.Extensions;

using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public interface IChatService
    {
        Task<IPagedModel<ThreadResponseModel>> GetParticipatedThread(string email, int page = 1, int limit = 10, string keyword = "", CancellationToken cancellationToken = default);

        Task<CreateThreadResponseModel> CreateThreadAsync(CreateThreadRequestModel model, CancellationToken cancellationToken = default);        

        Task<bool> IsValidThread(string threadId, CancellationToken cancellationToken = default);

        Task<ThreadResponseModel> AddUserToThreadAsync(AddUserToThreadRequestModel model, CancellationToken cancellationToken = default);

        Task<ThreadResponseModel> RemoveUserFromThreadAsync(RemoveUserFromThreadRequestModel model, CancellationToken cancellationToken = default);

        Task<int> DeleteThreadAsync(DeleteThreadRequest model, CancellationToken cancellationToken = default);

        Task<int> WithdrawFromAllThread(string email, CancellationToken cancellationToken = default);

        Task<ChatMessageModel> SendMessageAsync(SendMessageRequestModel model, CancellationToken cancellationToken = default);
    }
}