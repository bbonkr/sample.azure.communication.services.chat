using System;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Sample.Chat.Services.Mappers;

namespace Sample.Chat.Services
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddChatServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("AzureCommunicationServices");
            var uri = new Uri(connectionString.Replace("endpoint=", string.Empty, StringComparison.OrdinalIgnoreCase));
            var gateway = $"{uri.Scheme}://{uri.Host}";

            services.Configure<AzureCommunicationServicesOptions>(options =>
            {
                options.ConnectionString = connectionString;
                options.GatewayUrl = gateway;
            });

            services.AddAutoMapper(typeof(UserProfile).Assembly);
            

            return services;
        }
    }
}
