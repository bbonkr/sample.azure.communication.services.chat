
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Sample.Chat.Entities;

namespace Sample.Chat.Data.EntityTypeConfigurations
{
    internal class ThreadPrticipantTypeConfiguration : IEntityTypeConfiguration<ThreadParticipant>
    {
        public void Configure(EntityTypeBuilder<ThreadParticipant> builder)
        {
            builder.ToTable(nameof(ThreadParticipant));

            builder.HasKey(x => new { x.ThreadId, x.UserId });

            builder.Property(x => x.ThreadId)
                .IsRequired()
                .HasMaxLength(1000)
                .HasComment("Thread identifier");

            builder.Property(x => x.UserId)
                .IsRequired()
                .HasMaxLength(1000)
                .HasComment("User identifier; Use Communication user id");

            builder.HasOne(x => x.Thread)
                .WithMany(x => x.Participants)
                .HasForeignKey(x => x.ThreadId);

            builder.HasOne(x => x.User)
                .WithMany(x => x.Threads)
                .HasForeignKey(x => x.UserId);
        }
    }
}
