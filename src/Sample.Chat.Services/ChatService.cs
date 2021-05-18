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
    public class ChatService
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

        public async Task<int> CreateThreadAsync(CreateThreadRequestModel model, CancellationToken cancellationToken = default)
        {
            var chatClient = await GetChatClient(cancellationToken);

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

        public async Task<int> AddUserAsync(AddUserToThreadRequestModel model, CancellationToken cancellationToken = default)
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

            var chatClient = await GetChatClient(cancellationToken);

            var chatThreadClient = chatClient.GetChatThreadClient(model.ThreadId);

            var threadProperties = await chatThreadClient.GetPropertiesAsync();

            var usersToAdd = dbContext.Users.Where(x => model.ParticipantIds.Contains(x.Id)).AsNoTracking();

            var addUserIds = new List<string>();

            foreach(var userId in model.ParticipantIds)
            {
                var user = await usersToAdd.Where(x => x.Id == userId).FirstOrDefaultAsync(cancellationToken);
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

        public async Task<int> RemoveUserAsync(RemoveUserFromThreadRequestModel model, CancellationToken cancellationToken = default)
        {
            var currentThread = await dbContext.Threads
                .Include(x=>x.Prticipants)
                .Where(x => x.Id == model.ThreadId).FirstOrDefaultAsync(cancellationToken);

            if (currentThread == null)
            {
                logger.LogWarning($"Could not find the thread. (ThreadId: {model.ThreadId})");

                return 0;
            }

            var chatClient = await GetChatClient(cancellationToken);
            
            var chatThreadClient = chatClient.GetChatThreadClient(model.ThreadId);

            var threadProperties = await chatThreadClient.GetPropertiesAsync();

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

        public async Task<bool> IsValidThread(string threadId, CancellationToken cancellationToken = default)
        {
            return await dbContext.Threads.Where(x => x.Id == threadId).AnyAsync(cancellationToken);
        }

        private async Task<ChatClient> GetChatClient(CancellationToken cancellationToken = default)
        {
            var moderator = await dbContext.Users
               .Where(x => x.IsModerator)
               .AsNoTracking()
               .FirstOrDefaultAsync(cancellationToken);

            var token = string.Empty;

            if (moderator == null)
            {
                var tokenResult = await userTokenManager.GenerateTokenAsync(azureCommunicationServicesOptions.ConnectionString);

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
                var tokenResult = await userTokenManager.GenerateTokenAsync(azureCommunicationServicesOptions.ConnectionString, moderator.Id);
                token = tokenResult.Token;
            }

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
}
