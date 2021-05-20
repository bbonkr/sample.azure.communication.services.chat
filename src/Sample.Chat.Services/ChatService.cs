using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using Azure.Communication;
using Azure.Communication.Chat;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using Sample.Chat.Data;
using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public class ChatService : IChatService
    {
        public ChatService(
            DefaultDbContext dbContext,
            IUserTokenManager userTokenManager,
            IOptionsMonitor<AzureCommunicationServicesOptions> azureCommunicationServicesOptionsMonitor,
            ILoggerFactory loggerFactory)
        {
            this.dbContext = dbContext;
            this.userTokenManager = userTokenManager;
            azureCommunicationServicesOptions = azureCommunicationServicesOptionsMonitor.CurrentValue ?? throw new Exception("Azure Communication Service configuration is invalid.");
            logger = loggerFactory.CreateLogger<ChatService>();
        }

        /// <summary>
        /// Create chat thread
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<int> CreateThreadAsync(CreateThreadRequestModel model, CancellationToken cancellationToken = default)
        {
            var chatClient = await GetModeratorChatClientAsync(cancellationToken);

            var createChatThreadResult = await chatClient.CreateChatThreadAsync(
                model.Topic,
                participants: model.ParticipantIds.Select(userId => new ChatParticipant(new CommunicationUserIdentifier(userId))),
                cancellationToken: cancellationToken);

            var thread = new Entities.Thread
            {
                Id = createChatThreadResult.Value.ChatThread.Id,
                Topic = createChatThreadResult.Value.ChatThread.Topic,
                Prticipants = model.ParticipantIds.Select(userId => new Entities.ThreadParticipant
                {
                    UserId = userId
                }).ToList(),
            };

            dbContext.Threads.Add(thread);

            var affectedCreateThread = await dbContext.SaveChangesAsync(cancellationToken);

            return affectedCreateThread;
        }

        /// <summary>
        /// Participate in the thread
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<int> AddUserToThreadAsync(AddUserToThreadRequestModel model, CancellationToken cancellationToken = default)
        {
            var currentThread = await dbContext.Threads
                .Include(x => x.Prticipants)
                .Where(x => x.Id == model.ThreadId)
                .FirstOrDefaultAsync(cancellationToken);

            if (currentThread == null)
            {
                logger.LogWarning($"Could not find the thread. (ThreadId: {model.ThreadId})");

                return 0;
            }

            var chatClient = await GetModeratorChatClientAsync(cancellationToken);

            var chatThreadClient = chatClient.GetChatThreadClient(model.ThreadId);

            var threadProperties = await chatThreadClient.GetPropertiesAsync(cancellationToken);

            var usersToAdd = await dbContext.Users.Where(x => model.ParticipantIds.Contains(x.Id))
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var addUserIds = new List<string>();

            foreach (var userId in model.ParticipantIds)
            {
                var user = usersToAdd.Where(x => x.Id == userId).FirstOrDefault();
                if (user != null)
                {
                    var participant = new ChatParticipant(new CommunicationUserIdentifier(user.Id));
                    participant.DisplayName = user.DisplayName;
                    participant.ShareHistoryTime = threadProperties.Value.CreatedOn;

                    try
                    {
                        var result = await chatThreadClient.AddParticipantAsync(participant, cancellationToken);
                        addUserIds.Add(user.Id);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, $"Error occurred while adding user to thread. (ThreadId: {model.ThreadId} | UserId: {user.Id} )");
                    }
                }
            }


            if (addUserIds.Count > 0)
            {

                if (currentThread != null)
                {
                    foreach (var userId in addUserIds)
                    {
                        currentThread.Prticipants.Add(new Entities.ThreadParticipant
                        {
                            UserId = userId
                        });
                    }

                    return await dbContext.SaveChangesAsync(cancellationToken);
                }
            }

            return 0;
        }

        /// <summary>
        /// Withdraw from the thread
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<int> RemoveUserFromThreadAsync(RemoveUserFromThreadRequestModel model, CancellationToken cancellationToken = default)
        {
            var currentThread = await dbContext.Threads
                .Include(x => x.Prticipants)
                .Where(x => x.Id == model.ThreadId).FirstOrDefaultAsync(cancellationToken);

            if (currentThread == null)
            {
                logger.LogWarning($"Could not find the thread. (ThreadId: {model.ThreadId})");

                return 0;
            }

            var chatClient = await GetModeratorChatClientAsync(cancellationToken);

            var chatThreadClient = chatClient.GetChatThreadClient(model.ThreadId);

            var threadProperties = await chatThreadClient.GetPropertiesAsync(cancellationToken);

            var removeUserIds = new List<string>();

            foreach (var userId in model.ParticipantIds)
            {
                try
                {
                    var result = await chatThreadClient.RemoveParticipantAsync(new CommunicationUserIdentifier(userId), cancellationToken);
                    removeUserIds.Add(userId);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error occurred while removing user to thread. (ThreadId: {model.ThreadId} | UserId: {userId} )");
                }
            }

            if (removeUserIds.Count > 0)
            {

                if (currentThread != null)
                {
                    foreach (var userId in removeUserIds)
                    {
                        var userToRemove = currentThread.Prticipants.Where(x => x.UserId == userId).FirstOrDefault();
                        if (userToRemove != null)
                        {
                            currentThread.Prticipants.Remove(userToRemove);
                        }
                    }

                    return await dbContext.SaveChangesAsync(cancellationToken);
                }
            }

            return 0;
        }

        public async Task<int> WithdrawFromAllThread(string email, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email address does not allow empty", nameof(email));
            }

            var user = await dbContext.Users
                .Include(x => x.Threads)
                .Where(x => x.Email == email.Trim())
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                throw new Exception($"Does not find the user. ({email})");
            }


            var chatClient = await GetUserChatClientAsync(user.Id, cancellationToken);

            var processed = 0;

            foreach (var thread in user.Threads)
            {
                try
                {
                    var chatThreadClient = chatClient.GetChatThreadClient(thread.ThreadId);
                    await chatThreadClient.RemoveParticipantAsync(new CommunicationUserIdentifier(user.Id), cancellationToken);

                    processed++;
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error occurred while removing user to thread. (ThreadId: {thread.ThreadId} | UserId: {user.Id} )");
                }
            }

            return processed;
        }

        /// <summary>
        /// Verifies thread is valid.
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<bool> IsValidThread(string threadId, CancellationToken cancellationToken = default)
        {
            return await dbContext.Threads.Where(x => x.Id == threadId).AnyAsync(cancellationToken);
        }

        /// <summary>
        /// Send the message in thread.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<string> SendMessageAsync(SendMessageRequestModel model, CancellationToken cancellationToken = default)
        {
            if (!(await IsValidThread(model.ThreadId)))
            {
                throw new ArgumentException($"Could not find the thread. (${model.ThreadId})", nameof(model.ThreadId));
            }

            if (!(await IsParticipant(model.ThreadId, model.SenderId, cancellationToken)))
            {
                throw new Exception("Could not send message because did not participate in the thread.");
            }

            var user = await dbContext.Users
            .Where(x => x.Id == model.SenderId)
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                throw new ArgumentException($"Could not find the user. ({model.SenderId})", nameof(model.SenderId));
            }

            var chatClient = await GetUserChatClientAsync(model.SenderId, cancellationToken);

            var chatThreadClient = chatClient.GetChatThreadClient(model.ThreadId);

            var threadProperties = await chatThreadClient.GetPropertiesAsync(cancellationToken);

            var chatMessageType = model.ContentType == ChatContentType.Html ? ChatMessageType.Html : ChatMessageType.Text;

            var response = await chatThreadClient.SendMessageAsync(model.Content, chatMessageType, user.DisplayName, cancellationToken);

            return response.Value.Id;
        }


        private async Task<bool> IsParticipant(string threadId, string userId, CancellationToken cancellationToken = default)
        {
            return await dbContext.Threads
                .Include(x => x.Prticipants)
                .Where(x => x.Id == threadId)
                .Where(x => x.Prticipants.Any(y => y.UserId == userId))
                .AnyAsync(cancellationToken);
        }

        private async Task<ChatClient> GetUserChatClientAsync(string userId, CancellationToken cancellationToken = default)
        {
            var tokenResult = await userTokenManager.GenerateTokenAsync(azureCommunicationServicesOptions.ConnectionString, userId, cancellationToken);
            var token = tokenResult.Token;

            return GetChatClient(token);
        }

        private async Task<ChatClient> GetModeratorChatClientAsync(CancellationToken cancellationToken = default)
        {
            var moderator = await dbContext.Users
              .Where(x => x.IsModerator)
              .AsNoTracking()
              .FirstOrDefaultAsync(cancellationToken);

            var token = string.Empty;

            if (moderator == null)
            {
                var tokenResult = await userTokenManager.GenerateTokenAsync(azureCommunicationServicesOptions.ConnectionString, cancellationToken);

                moderator = new Entities.User
                {
                    Id = tokenResult.User.Id,
                    DisplayName = "Operator",
                    Email = "operator@localhost",
                    IsModerator = true,
                    IsBot = false,
                };

                dbContext.Users.Add(moderator);
                var affectedCreateModerator = await dbContext.SaveChangesAsync(cancellationToken);

                if (affectedCreateModerator == 0)
                {
                    throw new Exception("Fail to create Operator user.");
                }

                token = tokenResult.AccessToken.Token;
            }
            else
            {
                var tokenResult = await userTokenManager.GenerateTokenAsync(azureCommunicationServicesOptions.ConnectionString, moderator.Id, cancellationToken);
                token = tokenResult.Token;
            }

            return GetChatClient(token);
        }

        private ChatClient GetChatClient(string token)
        {
            var chatClient = new ChatClient(
            new Uri(azureCommunicationServicesOptions.GatewayUrl),
            new Azure.Communication.CommunicationTokenCredential(token)
            );

            return chatClient;
        }

        private readonly DefaultDbContext dbContext;
        private readonly AzureCommunicationServicesOptions azureCommunicationServicesOptions;
        private readonly IUserTokenManager userTokenManager;
        private readonly ILogger logger;
    }

    public enum ChatContentType
    {
        Text,
        Html,
    }
}
