using Azure.Communication;
using Azure.Communication.Identity;
using Azure.Core;

using System.Threading.Tasks;

namespace Sample.Chat.Services
{
    public interface IUserTokenManager
    {
        Task<CommunicationUserIdentifierAndToken> GenerateTokenAsync(string resourceConnectionString);
        Task<AccessToken> GenerateTokenAsync(string resourceConnectionString, string identity);
        Task<AccessToken> RefreshTokenAsync(string resourceConnectionString, string expiredToken);
    }

    public class UserTokenManager: IUserTokenManager
    {
        public async Task<CommunicationUserIdentifierAndToken> GenerateTokenAsync(string resourceConnectionString)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var userResponse = await communicationIdentityClient.CreateUserAndTokenAsync(scopes: new[] { CommunicationTokenScope.Chat });
                return userResponse.Value;
            }
            catch
            {
                throw;
            }
        }

        public async Task<AccessToken> GenerateTokenAsync(string resourceConnectionString, string identity)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var userResponse = await communicationIdentityClient.GetTokenAsync(new CommunicationUserIdentifier(identity), scopes: new[] { CommunicationTokenScope.Chat });
                return userResponse.Value;
            }
            catch
            {
                throw;
            }
        }

        public async Task<AccessToken> RefreshTokenAsync(string resourceConnectionString, string identity)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var user = new CommunicationUserIdentifier(identity);
                var tokenResponse = await communicationIdentityClient.GetTokenAsync(user, scopes: new[] { CommunicationTokenScope.Chat });
                return tokenResponse;
            }
            catch
            {
                throw;
            }
        }
    }
}
