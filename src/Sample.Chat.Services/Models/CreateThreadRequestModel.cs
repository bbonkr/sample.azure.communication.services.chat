using System.Collections.Generic;

namespace Sample.Chat.Services.Models
{
    public class CreateThreadRequestModel
    {
        public string Topic { get; set; }

        public IEnumerable<string> ParticipantIds { get; set; }
    }

    public class CreateThreadResponseModel
    {
        public string Id { get; set; }
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

    public class ThreadResponseModel
    {
        public string Id { get; set; }

        public string Topic { get; set; }

        public IEnumerable<Participant> Participants { get; set; }
    }

    public class Participant
    {
        public string DisplayName { get; set; }
    }

    public class DeleteThreadRequest
    {
        public string ThreadId { get; set; }

        public bool Force { get; set; } = false;
    }
}
