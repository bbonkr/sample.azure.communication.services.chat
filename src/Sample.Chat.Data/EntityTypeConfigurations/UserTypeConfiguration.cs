using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Sample.Chat.Entities;

namespace Sample.Chat.Data.EntityTypeConfigurations
{
    internal class UserTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable(nameof(User));
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasMaxLength(1000)
                .HasComment("CommunicationUserId");

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(500)
                .HasComment("Email address");

            builder.Property(x => x.DisplayName)
                .IsRequired()
                .HasMaxLength(500)
                .HasComment("Display name");

            builder.HasIndex(x => x.Email).IsUnique();
        }
    }
}
