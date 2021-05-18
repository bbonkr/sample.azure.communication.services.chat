using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using AutoMapper;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using Sample.Chat.Data;
using Sample.Chat.Entities;
using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public class UserService
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


        public Task<UserModel> CreateUserAsync(CreateUserRequestModel model)
        {
            throw new NotImplementedException();
        }

        public async Task<UserModel> GetUserAsync(GetUserRequestModel model, CancellationToken cancellationToken = default)
        {
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
            }

            return user;
        }

        public async Task<UserModel> RefreshTokenAsync(GetUserRequestModel model, CancellationToken cancellationToken = default)
        {
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

            foreach (var thread in user.Threads)
            {
                // TODO: Leave related threads and remove records.
                //thread.Thread.Id
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
