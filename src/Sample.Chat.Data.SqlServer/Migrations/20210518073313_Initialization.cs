using Microsoft.EntityFrameworkCore.Migrations;

namespace Sample.Chat.Data.SqlServer.Migrations
{
    public partial class Initialization : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Thread",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false, comment: "Thread identifier"),
                    Topic = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false, comment: "Thread topic")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Thread", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false, comment: "CommunicationUserId"),
                    Email = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false, comment: "Email address"),
                    DisplayName = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false, comment: "Display name")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ThreadPrticipant",
                columns: table => new
                {
                    ThreadId = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false, comment: "User identifier; Use Communication user id"),
                    UserId = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false, comment: "Thread identifier")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThreadPrticipant", x => new { x.ThreadId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ThreadPrticipant_Thread_ThreadId",
                        column: x => x.ThreadId,
                        principalTable: "Thread",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThreadPrticipant_User_ThreadId",
                        column: x => x.ThreadId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                table: "User",
                column: "Email",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ThreadPrticipant");

            migrationBuilder.DropTable(
                name: "Thread");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
