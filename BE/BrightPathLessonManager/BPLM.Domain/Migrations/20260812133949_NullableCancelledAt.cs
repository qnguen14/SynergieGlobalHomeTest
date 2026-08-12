using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BPLM.Domain.Migrations
{
    /// <inheritdoc />
    public partial class NullableCancelledAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "notes",
                schema: "BPLM",
                table: "Lessons",
                newName: "note");

            migrationBuilder.AlterColumn<DateTime>(
                name: "cancelled_at",
                schema: "BPLM",
                table: "Lessons",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "note",
                schema: "BPLM",
                table: "Lessons",
                newName: "notes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "cancelled_at",
                schema: "BPLM",
                table: "Lessons",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
