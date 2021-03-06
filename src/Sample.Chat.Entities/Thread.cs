using System;
using System.Collections.Generic;

namespace Sample.Chat.Entities
{
    public class Thread
    {
        public string Id { get; set; }

        public string Topic { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }

        public virtual ICollection<ThreadParticipant> Participants { get; set; }

    }
}
