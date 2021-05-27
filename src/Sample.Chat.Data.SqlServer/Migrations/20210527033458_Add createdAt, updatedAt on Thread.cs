using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Sample.Chat.Data.SqlServer.Migrations
{
    public partial class AddcreatedAtupdatedAtonThread : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Thread",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(2021, 5, 27, 3, 34, 57, 903, DateTimeKind.Unspecified).AddTicks(7773), new TimeSpan(0, 0, 0, 0, 0)),
                comment: "Created");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "Thread",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(2021, 5, 27, 3, 34, 57, 903, DateTimeKind.Unspecified).AddTicks(8185), new TimeSpan(0, 0, 0, 0, 0)),
                comment: "Updated");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Attachment",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(2021, 5, 27, 3, 34, 57, 892, DateTimeKind.Unspecified).AddTicks(3433), new TimeSpan(0, 0, 0, 0, 0)),
                comment: "Created at",
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset",
                oldDefaultValue: new DateTimeOffset(new DateTime(2021, 5, 27, 2, 59, 56, 470, DateTimeKind.Unspecified).AddTicks(9353), new TimeSpan(0, 0, 0, 0, 0)),
                oldComment: "Created at");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Thread");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Thread");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Attachment",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(2021, 5, 27, 2, 59, 56, 470, DateTimeKind.Unspecified).AddTicks(9353), new TimeSpan(0, 0, 0, 0, 0)),
                comment: "Created at",
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset",
                oldDefaultValue: new DateTimeOffset(new DateTime(2021, 5, 27, 3, 34, 57, 892, DateTimeKind.Unspecified).AddTicks(3433), new TimeSpan(0, 0, 0, 0, 0)),
                oldComment: "Created at");
        }
    }
}
