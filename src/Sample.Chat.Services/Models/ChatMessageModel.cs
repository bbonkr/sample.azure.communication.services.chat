using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Azure.Communication.Chat;

namespace Sample.Chat.Services.Models
{
    public class ChatMessageModel 
    {
      
        public string  Id { get; set; }

        public string Type { get; set; }

        public string SequenceId { get; set; }

        public string Version { get; set; }

        public ChatMessageContentModel Content { get; set; }
        public string senderDisplayName { get; set; }

        public long CreatedOn { get; set; }

        public CommunicationUserIdentifierModel Sender { get; set; }

        public long? DeletedOn { get; set; }

        public long? EditedOn { get; set; }
    }

    public class ChatMessageContentModel
    {
        public string Message { get; set; }

        public string Topic { get; set; }

        public IEnumerable<ChatParticipantModel> ChatParticipant { get;set; }

        public CommunicationUserIdentifierModel initiator { get; set; }
    }

    public class CommunicationUserIdentifierModel
    {
        public string CommunicationUserId { get; set; }

        public string Kind { get; set; }

    }

    public class ChatParticipantModel
    {
        public CommunicationUserIdentifierModel Id { get; set; }

        public string DisplayName { get; set; }

        public long? ShareHistoryTime { get; set; }
    }
}
