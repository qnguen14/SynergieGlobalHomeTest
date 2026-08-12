using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BPLM.Domain.Migrations
{
    /// <inheritdoc />
    public partial class RenameLessonStatusColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                schema: "BPLM",
                table: "Lessons",
                newName: "status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "status",
                schema: "BPLM",
                table: "Lessons",
                newName: "Status");
        }
    }
}
