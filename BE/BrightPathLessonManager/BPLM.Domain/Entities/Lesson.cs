using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BPLM.Domain.Entities;

public enum LessonStatus
{
    Booked = 1,
    Cancelled = 2,
    NoShow = 3,
}

public class Lesson
{
    [Key]
    [Required]
    [Column("lesson_id")]
    public string LessonID { get; set; }
    
    [Required]
    [Column("date")]
    public DateOnly Date { get; set; }
    
    [Required]
    [Column("start_time")]
    public TimeOnly StartTime { get; set; }
    
    [Required]
    [Column("duration_min")]
    public string DurationMin { get; set; }
    
    [Required]
    [Column("student")]
    public string Student { get; set; }
    
    [Required]
    [Column("tutor_id")]
    [ForeignKey(nameof(Tutor))]
    public string TutorID { get; set; }
    public virtual Tutor Tutor { get; set;}
    
    [Required]
    [Column("room")]
    public string Room { get; set; }
    
    [Required]
    [Column("status")]
    public LessonStatus Status { get; set; }
    
    [Column("cancelled_at")]
    public DateTime? CancelledAt { get; set; }

    [Column("is_exam")] public bool IsExam { get; set; } = false;
    
    [Column("note")]
    public string? Notes { get; set; }
}