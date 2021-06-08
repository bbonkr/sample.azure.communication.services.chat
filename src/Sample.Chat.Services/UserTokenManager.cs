using Azure.Communication;
using Azure.Communication.Identity;
using Azure.Core;

using System.Threading;
using System.Threading.Tasks;

namespace Sample.Chat.Services
{
    public interface IUserTokenManager
    {
        Task<CommunicationUserIdentifierAndToken> GenerateTokenAsync(string resourceConnectionString, CancellationToken cancellationToken = default);
        Task<AccessToken> GenerateTokenAsync(string resourceConnectionString, string identity, CancellationToken cancellationToken = default);
        Task<AccessToken> RefreshTokenAsync(string resourceConnectionString, string expiredToken, CancellationToken cancellationToken = default);
    }

    public class UserTokenManager: IUserTokenManager
    {
        public async Task<CommunicationUserIdentifierAndToken> GenerateTokenAsync(string resourceConnectionString, CancellationToken cancellationToken = default)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var userResponse = await communicationIdentityClient.CreateUserAndTokenAsync(scopes: new[] { CommunicationTokenScope.Chat }, cancellationToken);
                return userResponse.Value;
            }
            catch
            {
                throw;
            }
        }

        public async Task<AccessToken> GenerateTokenAsync(string resourceConnectionString, string identity, CancellationToken cancellationToken = default)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var userResponse = await communicationIdentityClient.GetTokenAsync(new CommunicationUserIdentifier(identity), scopes: new[] { CommunicationTokenScope.Chat }, cancellationToken);
                return userResponse.Value;
            }
            catch
            {
                throw;
            }
        }

        public async Task<AccessToken> RefreshTokenAsync(string resourceConnectionString, string identity, CancellationToken cancellationToken = default)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var user = new CommunicationUserIdentifier(identity);
                var tokenResponse = await communicationIdentityClient.GetTokenAsync(user, scopes: new[] { CommunicationTokenScope.Chat }, cancellationToken);
                return tokenResponse;
            }
            catch
            {
                throw;
            }
        }
    }
}
