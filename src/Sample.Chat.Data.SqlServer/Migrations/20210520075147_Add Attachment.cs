using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Sample.Chat.Data.SqlServer.Migrations
{
    public partial class AddAttachment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThreadPrticipant_Thread_ThreadId",
                table: "ThreadPrticipant");

            migrationBuilder.DropForeignKey(
                name: "FK_ThreadPrticipant_User_ThreadId",
                table: "ThreadPrticipant");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ThreadPrticipant",
                table: "ThreadPrticipant");

            migrationBuilder.RenameTable(
                name: "ThreadPrticipant",
                newName: "ThreadParticipant");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ThreadParticipant",
                table: "ThreadParticipant",
                columns: new[] { "ThreadId", "UserId" });

            migrationBuilder.CreateTable(
                name: "Attachment",
                columns: table => new
                {
                    Id = table.Column<string>(type: "char(36)", nullable: false, comment: "Identifier"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false, comment: "File name"),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "application/octet-stream", comment: "Content type"),
                    Size = table.Column<long>(type: "bigint", nullable: false, defaultValue: 0L, comment: "Size of file"),
                    Uri = table.Column<string>(type: "nvarchar(max)", nullable: false, comment: "Uri where file is"),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false, defaultValue: new DateTimeOffset(new DateTime(2021, 5, 20, 7, 51, 46, 825, DateTimeKind.Unspecified).AddTicks(154), new TimeSpan(0, 0, 0, 0, 0)), comment: "Created at")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachment", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_ThreadParticipant_Thread_ThreadId",
                table: "ThreadParticipant",
                column: "ThreadId",
                principalTable: "Thread",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThreadParticipant_User_ThreadId",
                table: "ThreadParticipant",
                column: "ThreadId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThreadParticipant_Thread_ThreadId",
                table: "ThreadParticipant");

            migrationBuilder.DropForeignKey(
                name: "FK_ThreadParticipant_User_ThreadId",
                table: "ThreadParticipant");

            migrationBuilder.DropTable(
                name: "Attachment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ThreadParticipant",
                table: "ThreadParticipant");

            migrationBuilder.RenameTable(
                name: "ThreadParticipant",
                newName: "ThreadPrticipant");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ThreadPrticipant",
                table: "ThreadPrticipant",
                columns: new[] { "ThreadId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ThreadPrticipant_Thread_ThreadId",
                table: "ThreadPrticipant",
                column: "ThreadId",
                principalTable: "Thread",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThreadPrticipant_User_ThreadId",
                table: "ThreadPrticipant",
                column: "ThreadId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
