using System;
using System.Collections.Generic;

namespace Sample.Chat.Entities
{
    public class User
    {
        /// <summary>
        /// Use CommunicationUserId 
        /// </summary>
        public string Id { get; set; }

        public string Email { get; set; }

        public string DisplayName { get; set; }

        public virtual ICollection<ThreadParticipant> Threads { get; set; }
    }
}
