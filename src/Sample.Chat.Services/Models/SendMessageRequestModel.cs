namespace Sample.Chat.Services.Models
{
    public class SendMessageRequestModel
    {
        public string ThreadId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }

        public ChatContentType ContentType { get; set; } = ChatContentType.Text;
    }
}
