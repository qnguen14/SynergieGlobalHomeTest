using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BPLM.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddIsExamToLesson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_exam",
                schema: "BPLM",
                table: "Lessons",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_exam",
                schema: "BPLM",
                table: "Lessons");
        }
    }
}
