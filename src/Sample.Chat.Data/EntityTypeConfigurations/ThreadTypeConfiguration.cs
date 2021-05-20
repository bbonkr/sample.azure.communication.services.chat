
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Sample.Chat.Entities;

namespace Sample.Chat.Data.EntityTypeConfigurations
{
    internal class ThreadTypeConfiguration : IEntityTypeConfiguration<Thread>
    {
        public void Configure(EntityTypeBuilder<Thread> builder)
        {
            builder.ToTable(nameof(Thread));

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
              .IsRequired()
              .HasMaxLength(1000)
              .HasComment("Thread identifier");

            builder.Property(x => x.Topic)
                .HasMaxLength(1000)
                .IsRequired()
                .HasComment("Thread topic");
        }
    }
}
