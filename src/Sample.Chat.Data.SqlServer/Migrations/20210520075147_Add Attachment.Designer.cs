// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Sample.Chat.Data;

namespace Sample.Chat.Data.SqlServer.Migrations
{
    [DbContext(typeof(DefaultDbContext))]
    [Migration("20210520075147_Add Attachment")]
    partial class AddAttachment
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.6")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Sample.Chat.Entities.Attachment", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasComment("Identifier");

                    b.Property<string>("ContentType")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(max)")
                        .HasDefaultValue("application/octet-stream")
                        .HasComment("Content type");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetimeoffset")
                        .HasDefaultValue(new DateTimeOffset(new DateTime(2021, 5, 20, 7, 51, 46, 825, DateTimeKind.Unspecified).AddTicks(154), new TimeSpan(0, 0, 0, 0, 0)))
                        .HasComment("Created at");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("File name");

                    b.Property<long>("Size")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasDefaultValue(0L)
                        .HasComment("Size of file");

                    b.Property<string>("Uri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("Uri where file is");

                    b.HasKey("Id");

                    b.ToTable("Attachment");
                });

            modelBuilder.Entity("Sample.Chat.Entities.Thread", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("Thread identifier");

                    b.Property<string>("Topic")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("Thread topic");

                    b.HasKey("Id");

                    b.ToTable("Thread");
                });

            modelBuilder.Entity("Sample.Chat.Entities.ThreadParticipant", b =>
                {
                    b.Property<string>("ThreadId")
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("User identifier; Use Communication user id");

                    b.Property<string>("UserId")
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("Thread identifier");

                    b.HasKey("ThreadId", "UserId");

                    b.ToTable("ThreadParticipant");
                });

            modelBuilder.Entity("Sample.Chat.Entities.User", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("CommunicationUserId");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)")
                        .HasComment("Display name");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)")
                        .HasComment("Email address");

                    b.Property<bool>("IsBot")
                        .HasColumnType("bit");

                    b.Property<bool>("IsModerator")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("User");
                });

            modelBuilder.Entity("Sample.Chat.Entities.ThreadParticipant", b =>
                {
                    b.HasOne("Sample.Chat.Entities.Thread", "Thread")
                        .WithMany("Participants")
                        .HasForeignKey("ThreadId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Sample.Chat.Entities.User", "User")
                        .WithMany("Threads")
                        .HasForeignKey("ThreadId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Thread");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Sample.Chat.Entities.Thread", b =>
                {
                    b.Navigation("Participants");
                });

            modelBuilder.Entity("Sample.Chat.Entities.User", b =>
                {
                    b.Navigation("Threads");
                });
#pragma warning restore 612, 618
        }
    }
}
