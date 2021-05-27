using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Sample.Chat.Data.SqlServer.Migrations
{
    public partial class FixFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThreadParticipant_User_ThreadId",
                table: "ThreadParticipant");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Attachment",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(2021, 5, 27, 2, 59, 56, 470, DateTimeKind.Unspecified).AddTicks(9353), new TimeSpan(0, 0, 0, 0, 0)),
                comment: "Created at",
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset",
                oldDefaultValue: new DateTimeOffset(new DateTime(2021, 5, 20, 7, 51, 46, 825, DateTimeKind.Unspecified).AddTicks(154), new TimeSpan(0, 0, 0, 0, 0)),
                oldComment: "Created at");

            migrationBuilder.CreateIndex(
                name: "IX_ThreadParticipant_UserId",
                table: "ThreadParticipant",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ThreadParticipant_User_UserId",
                table: "ThreadParticipant",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThreadParticipant_User_UserId",
                table: "ThreadParticipant");

            migrationBuilder.DropIndex(
                name: "IX_ThreadParticipant_UserId",
                table: "ThreadParticipant");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Attachment",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(2021, 5, 20, 7, 51, 46, 825, DateTimeKind.Unspecified).AddTicks(154), new TimeSpan(0, 0, 0, 0, 0)),
                comment: "Created at",
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset",
                oldDefaultValue: new DateTimeOffset(new DateTime(2021, 5, 27, 2, 59, 56, 470, DateTimeKind.Unspecified).AddTicks(9353), new TimeSpan(0, 0, 0, 0, 0)),
                oldComment: "Created at");

            migrationBuilder.AddForeignKey(
                name: "FK_ThreadParticipant_User_ThreadId",
                table: "ThreadParticipant",
                column: "ThreadId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
