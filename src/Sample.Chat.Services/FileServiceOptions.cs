namespace Sample.Chat.Services
{
    public class FileServiceOptions
    {
        public const string Name = "FileService";

        /// <summary>
        /// Path where file is saved.
        /// </summary>
        public string Container { get; set; }

        /// <summary>
        /// Uri for File access endpoint.
        /// </summary>
        public string AccessEndPoint { get; set; }
    }
}
