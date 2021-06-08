using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public interface IFileService
    {
        Task<IEnumerable<FileSavedResponseModel>> SaveAsync(IEnumerable<FileSavedRequestModel> models, CancellationToken cancellationToken = default);

        Task<GetFileResponseModel> GetFileContentAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
