using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using Sample.Chat.Data;
using Sample.Chat.Entities;
using Sample.Chat.Services.Models;

namespace Sample.Chat.Services
{
    public class FileService : IFileService
    {
        public FileService(
            IOptionsMonitor<FileServiceOptions> fileServiceOptionsMonitor,
            DefaultDbContext dbContext,
            ILogger<FileService> logger)
        {
            fileServiceOptions = fileServiceOptionsMonitor.CurrentValue ?? throw new Exception("File Service configuration is invalid.");
            this.dbContext = dbContext;
            this.logger = logger;
        }

        public async Task<IEnumerable<FileSavedResponseModel>> SaveAsync(IEnumerable<FileSavedRequestModel> models, CancellationToken cancellationToken = default)
        {
            var results = new List<FileSavedResponseModel>();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    foreach (var model in models)
                    {
                        if (model.Content == null || model.Content.Length == 0)
                        {
                            throw new ArgumentException($"Content does not allow null or empty.", nameof(model.Content));
                        }

                        if (string.IsNullOrWhiteSpace(model.FileName))
                        {
                            throw new ArgumentException("File name does not allow null or empty.", nameof(model.FileName));
                        }

                        if (string.IsNullOrWhiteSpace(fileServiceOptions.Container))
                        {
                            throw new ArgumentException($"Container does not allow null or empty.", nameof(fileServiceOptions.Container));
                        }

                        if (!Directory.Exists(fileServiceOptions.Container))
                        {
                            Directory.CreateDirectory(fileServiceOptions.Container);
                        }

                        var savedFileName = GetUniqeFileName(model.FileName);
                        var filePath = Path.Join(fileServiceOptions.Container, savedFileName);

                        var inserted = dbContext.Attachments.Add(new Entities.Attachment
                        {
                            Name = model.FileName,
                            Size = model.Content.Length,
                            ContentType = model.ContentType,
                            CreatedAt = DateTimeOffset.UtcNow,
                            Uri = filePath,
                        });

                        await dbContext.SaveChangesAsync(cancellationToken);

                        await File.WriteAllBytesAsync(filePath, model.Content, cancellationToken);

                        results.Add(new FileSavedResponseModel
                        {
                            Id = inserted.Entity.Id,
                            Uri = $"{fileServiceOptions.AccessEndPoint}/${inserted.Entity.Id}",
                            Html = RenderHtml(inserted.Entity),
                            FilePath = filePath,
                        });
                    }

                    await transaction.CommitAsync(cancellationToken);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error occurred when try to save the file.");
                    await transaction.RollbackAsync(cancellationToken);

                    foreach(var result in results)
                    {
                        if (File.Exists(result.FilePath))
                        {
                            try
                            {
                                File.Delete(result.FilePath);
                            }
                            catch
                            {
                                // Do nothing.
                            }
                        }
                    }

                    throw;
                }
            }

            return results;
        }

        public async Task<GetFileResponseModel> GetFileContentAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var attachment = await dbContext.Attachments
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            if (attachment == null)
            {
                throw new Exception($"Could not find a related content. ({id})");
            }

            if (!File.Exists(attachment.Uri))
            {
                throw new Exception($"Could not find a related content. ({id})");
            }

            var buffer = await File.ReadAllBytesAsync(attachment.Uri, cancellationToken);

            return new GetFileResponseModel
            {
                Content = buffer,
                ContentType = attachment.ContentType,
                FileName = attachment.Name,
                Size = attachment.Size,
                CreatedAt = attachment.CreatedAt,
            };

        }

        private string GetUniqeFileName(string fileName)
        {
            var name = string.Empty;
            var ext = string.Empty;

            var now = DateTimeOffset.UtcNow.Ticks;
            var guid = Guid.NewGuid().ToString();

            var tokens = fileName.Split('.');
            if (tokens.Length == 1)
            {
                name = fileName;
            }
            else
            {
                name = string.Join(".", tokens.Take(tokens.Length - 1));
                ext = tokens.Last();
            }

            return $"{name}-{guid}-{now}{ext}";
        }

        private string RenderHtml(Attachment attachment)
        {
            var uri = $"{fileServiceOptions.AccessEndPoint}/{attachment.Id}";

            if (attachment.ContentType.StartsWith("image/"))
            {
                // <figcaption>{attachment.Name}</figcaption>
                return $"<figure><img src=\"{uri}\" alt=\"{attachment.Name}\" /></figure>";
            }

            if (attachment.ContentType.StartsWith("audio/"))
            {
                return $"<figure><figcaption>Listen to {attachment.Name}</figcaption><audio control src=\"{uri}\">Your browser does not support the <code>audio</code> element.<a href=\"{uri}\">Download {attachment.Name}</a></audio></figure>";
            }

            if (attachment.ContentType.StartsWith("video/"))
            {
                return $"<video control><source src=\"{uri}\" type=\"{attachment.ContentType}\" /><a href=\"{uri}\">Download {attachment.Name}</a></video>";
            }

            return $"<a href=\"{uri}\" title=\"Download {attachment.Name}\" target=\"_blank\">{attachment.Name}</a>";
        }

        private readonly FileServiceOptions fileServiceOptions;
        private readonly DefaultDbContext dbContext;
        private readonly ILogger logger;
    }
}
