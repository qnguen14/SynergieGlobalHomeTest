using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BPLM.Domain.Migrations
{
    /// <inheritdoc />
    public partial class RenameTutorColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Subject",
                schema: "BPLM",
                table: "Tutors",
                newName: "subject");

            migrationBuilder.RenameColumn(
                name: "TutorName",
                schema: "BPLM",
                table: "Tutors",
                newName: "tutor_name");

            migrationBuilder.RenameColumn(
                name: "TutorId",
                schema: "BPLM",
                table: "Tutors",
                newName: "tutor_id");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                schema: "BPLM",
                table: "Tutors",
                newName: "phone");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "subject",
                schema: "BPLM",
                table: "Tutors",
                newName: "Subject");

            migrationBuilder.RenameColumn(
                name: "tutor_name",
                schema: "BPLM",
                table: "Tutors",
                newName: "TutorName");

            migrationBuilder.RenameColumn(
                name: "tutor_id",
                schema: "BPLM",
                table: "Tutors",
                newName: "TutorId");

            migrationBuilder.RenameColumn(
                name: "phone",
                schema: "BPLM",
                table: "Tutors",
                newName: "PhoneNumber");
        }
    }
}
