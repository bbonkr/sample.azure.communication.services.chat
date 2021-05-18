using Microsoft.EntityFrameworkCore.Migrations;

namespace Sample.Chat.Data.SqlServer.Migrations
{
    public partial class Adduserproperties : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBot",
                table: "User",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsModerator",
                table: "User",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBot",
                table: "User");

            migrationBuilder.DropColumn(
                name: "IsModerator",
                table: "User");
        }
    }
}
