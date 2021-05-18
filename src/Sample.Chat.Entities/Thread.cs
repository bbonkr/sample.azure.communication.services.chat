using System.Collections.Generic;

namespace Sample.Chat.Entities
{
    public class Thread
    {
        public string Id { get; set; }

        public string Topic { get; set; }

        public virtual ICollection<ThreadParticipant> Prticipants { get; set; }
    }
}
