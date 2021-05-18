using System.Collections.Generic;

namespace Sample.Chat.Services.Models
{
    public class CreateThreadRequestModel
    {
        public string Topic { get; set; }

        public IEnumerable<string> ParticipantIds { get; set; }
    }

    public class AddUserToThreadRequestModel
    {
        public string ThreadId { get; set; }

        public IEnumerable<string> ParticipantIds { get; set; }
    }

    public class RemoveUserFromThreadRequestModel
    {
        public string ThreadId { get; set; }

        public IEnumerable<string> ParticipantIds { get; set; }
    }
}
