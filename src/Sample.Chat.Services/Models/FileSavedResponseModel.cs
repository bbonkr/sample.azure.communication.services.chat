using System;

namespace Sample.Chat.Services.Models
{
    public class FileSavedRequestModel
    {
        public byte[] Content { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; } = "application/octet-stream";
    }

    public class FileSavedResponseModel
    {
        public Guid Id { get; set; }

        public string Uri { get; set; }

        public string Html { get; set; }

        public string FilePath { get; set; }
    }

    public class GetFileResponseModel
    {
        public byte[] Content { get; set; }

        public string FileName { get; set; }

        public long Size { get; set; }

        public string ContentType { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }
}
