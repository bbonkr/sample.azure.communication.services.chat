namespace Sample.Chat.Entities
{
    public class ThreadParticipant
    {
        public string ThreadId { get; set; }

        public string UserId { get; set; }

        public virtual Thread Thread { get; set; }

        public virtual User User { get; set; }
    }
}
