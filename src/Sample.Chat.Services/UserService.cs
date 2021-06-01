using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using AutoMapper;

using kr.bbon.EntityFrameworkCore.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using Sample.Chat.Data;
using Sample.Chat.Entities;
using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public class UserService : IUserService
    {
        public UserService(
            DefaultDbContext dbContext,
            IMapper mapper,
            IUserTokenManager userTokenManager,
            IOptionsMonitor<AzureCommunicationServicesOptions> azureCommunicationServicesOptionsMonitor)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.userTokenManager = userTokenManager;
            azureCommunicationServicesOptions = azureCommunicationServicesOptionsMonitor.CurrentValue ?? throw new Exception("Azure Communication Service configuration is invalid.");
        }

        public async Task<IPagedModel<UserModel>> GetUsersAsync(int page = 1, int limit = 10, string keyword = "", CancellationToken cancellationToken = default)
        {
            var query = dbContext.Users
                .Include(x => x.Threads)
                .Where(x => !x.IsModerator);

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x => EF.Functions.Like(x.DisplayName, $"%{keyword}%"));
            }


            var result = await query
                .Sort(nameof(User.DisplayName), true)
                .Sort(nameof(User.Id), true)
                .Select(x => mapper.Map<UserModel>(x))
                .AsNoTracking()
                .ToPagedModelAsync(page, limit, cancellationToken);

            return result;

        }

        public async Task<UserModel> CreateUserAsync(CreateUserRequestModel model, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                throw new ArgumentException("Please provide your email address.", nameof(model.Email));
            }

            if (string.IsNullOrEmpty(model.DisplayName))
            {
                throw new ArgumentException("Please provide your display name.", nameof(model.DisplayName));
            }

            if (await dbContext.Users.Where(x => x.Email == model.Email).AnyAsync(cancellationToken))
            {
                throw new Exception($"Could not register using the email address. ({model.Email})");
            }

            var token = await userTokenManager.GenerateTokenAsync(azureCommunicationServicesOptions.ConnectionString, cancellationToken);

            var user = new User
            {
                Id = token.User.Id,
                Email = model.Email.Trim(),
                DisplayName = model.DisplayName.Trim(),
                IsBot = false,
                IsModerator = false,
            };

            dbContext.Users.Add(user);

            await dbContext.SaveChangesAsync(cancellationToken);

            var response = mapper.Map<UserModel>(user);

            response.Token = token.AccessToken.Token;
            response.GatewayUrl = azureCommunicationServicesOptions.GatewayUrl;

            return response;
        }

        public async Task<UserModel> GetUserAsync(GetUserRequestModel model, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                throw new ArgumentException("Please provide your email address.", nameof(model.Email));
            }

            var user = await dbContext.Users
                .Where(x => x.Email == model.Email)
                .AsNoTracking()
                .Select(x => mapper.Map<UserModel>(x))
                .FirstOrDefaultAsync(cancellationToken);

            if (user != null)
            {
                var result = await userTokenManager.GenerateTokenAsync(azureCommunicationServicesOptions.ConnectionString, user.Id);

                user.Token = result.Token;
                user.ExpiresOn = result.ExpiresOn.Ticks;
                user.GatewayUrl = azureCommunicationServicesOptions.GatewayUrl;
            }

            return user;
        }

        public async Task<UserModel> RefreshTokenAsync(GetUserRequestModel model, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(model.Email.Trim()))
            {
                throw new ArgumentException("Please provide your email address.", nameof(model.Email));
            }

            var user = await dbContext.Users
               .Where(x => x.Email == model.Email)
               .AsNoTracking()
               .Select(x => mapper.Map<UserModel>(x))
               .FirstOrDefaultAsync(cancellationToken);

            if (user != null)
            {
                var result = await userTokenManager.GenerateTokenAsync(azureCommunicationServicesOptions.ConnectionString, user.Id);

                user.Token = result.Token;
                user.ExpiresOn = result.ExpiresOn.Ticks;
                user.GatewayUrl = azureCommunicationServicesOptions.GatewayUrl;
            }

            return user;
        }

        public async Task<int> DeleteAsync(GetUserRequestModel model, CancellationToken cancellationToken = default)
        {
            var user = await dbContext.Users
                .Include(x => x.Threads)
                .Where(x => x.Email == model.Email)
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                return 0;
            }

            dbContext.Users.Remove(user);

            var affected = await dbContext.SaveChangesAsync(cancellationToken);

            return affected;
        }

        private readonly DefaultDbContext dbContext;
        private readonly IMapper mapper;
        private readonly IUserTokenManager userTokenManager;
        private readonly AzureCommunicationServicesOptions azureCommunicationServicesOptions;
    }
}
