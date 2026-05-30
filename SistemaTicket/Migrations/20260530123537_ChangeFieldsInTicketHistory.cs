using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaTicket.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFieldsInTicketHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketHistories_AspNetUsers_ChangeById",
                table: "TicketHistories");

            migrationBuilder.RenameColumn(
                name: "ChangeById",
                table: "TicketHistories",
                newName: "ChangedById");

            migrationBuilder.RenameColumn(
                name: "ChangeAt",
                table: "TicketHistories",
                newName: "ChangedAt");

            migrationBuilder.RenameIndex(
                name: "IX_TicketHistories_ChangeById",
                table: "TicketHistories",
                newName: "IX_TicketHistories_ChangedById");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketHistories_AspNetUsers_ChangedById",
                table: "TicketHistories",
                column: "ChangedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketHistories_AspNetUsers_ChangedById",
                table: "TicketHistories");

            migrationBuilder.RenameColumn(
                name: "ChangedById",
                table: "TicketHistories",
                newName: "ChangeById");

            migrationBuilder.RenameColumn(
                name: "ChangedAt",
                table: "TicketHistories",
                newName: "ChangeAt");

            migrationBuilder.RenameIndex(
                name: "IX_TicketHistories_ChangedById",
                table: "TicketHistories",
                newName: "IX_TicketHistories_ChangeById");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketHistories_AspNetUsers_ChangeById",
                table: "TicketHistories",
                column: "ChangeById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
