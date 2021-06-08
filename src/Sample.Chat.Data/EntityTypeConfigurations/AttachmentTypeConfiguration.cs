
using System;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Sample.Chat.Entities;

namespace Sample.Chat.Data.EntityTypeConfigurations
{
    public class AttachmentTypeConfiguration : IEntityTypeConfiguration<Attachment>
    {
        public void Configure(EntityTypeBuilder<Attachment> builder)
        {
            builder.ToTable(nameof(Attachment));

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasColumnType("char(36)")
                .HasComment("Identifier")
                .ValueGeneratedOnAdd();

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100)
                .HasComment("File name");

            builder.Property(x => x.Size)
                .IsRequired()
                .HasDefaultValue(0)
                .HasComment("Size of file");

            builder.Property(x => x.ContentType)
                .IsRequired()
                .HasDefaultValue("application/octet-stream")
                .HasComment("Content type");

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasDefaultValue(DateTimeOffset.UtcNow)
                .HasComment("Created at");

            builder.Property(x => x.Uri)
                .IsRequired()
                .HasComment("Uri where file is");
        }
    }
}
