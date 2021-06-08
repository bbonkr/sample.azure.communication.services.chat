using System;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
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

            services.Configure<FileServiceOptions>(options =>
            {
                var sections = configuration.GetSection(FileServiceOptions.Name).GetChildren();
                foreach (var section in sections)
                {
                    if (section.Key == nameof(options.Container))
                    {
                        options.Container = section.Value;
                    }

                    if (section.Key == nameof(options.AccessEndPoint))
                    {
                        var url = section.Value;
                        if (url.EndsWith("/"))
                        {
                            url = url.Substring(0, url.Length - 1);
                        }

                        options.AccessEndPoint = url;
                    }
                }
            });

            services.AddAutoMapper(typeof(UserProfile).Assembly);

            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IChatService, ChatService>();
            services.AddTransient<IUserTokenManager, UserTokenManager>();
            services.AddTransient<IFileService, FileService>();

            return services;
        }
    }
}
