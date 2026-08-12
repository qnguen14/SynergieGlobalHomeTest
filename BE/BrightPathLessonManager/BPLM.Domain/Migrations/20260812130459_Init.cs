using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BPLM.Domain.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "BPLM");

            migrationBuilder.CreateTable(
                name: "Tutors",
                schema: "BPLM",
                columns: table => new
                {
                    TutorId = table.Column<string>(type: "text", nullable: false),
                    TutorName = table.Column<string>(type: "text", nullable: false),
                    Subject = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tutors", x => x.TutorId);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                schema: "BPLM",
                columns: table => new
                {
                    lesson_id = table.Column<string>(type: "text", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    start_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    duration_min = table.Column<string>(type: "text", nullable: false),
                    student = table.Column<string>(type: "text", nullable: false),
                    tutor_id = table.Column<string>(type: "text", nullable: false),
                    room = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    cancelled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.lesson_id);
                    table.ForeignKey(
                        name: "FK_Lessons_Tutors_tutor_id",
                        column: x => x.tutor_id,
                        principalSchema: "BPLM",
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_tutor_id",
                schema: "BPLM",
                table: "Lessons",
                column: "tutor_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lessons",
                schema: "BPLM");

            migrationBuilder.DropTable(
                name: "Tutors",
                schema: "BPLM");
        }
    }
}
