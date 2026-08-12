namespace BPLM.Domain.DTO.Lesson;

public class UpdateLessonRequest
{
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public string DurationMin { get; set; } = string.Empty;
    public string Student { get; set; } = string.Empty;
    public string TutorID { get; set; } = string.Empty;
    public string Room { get; set; } = string.Empty;
    public bool IsExam { get; set; }
    public bool ConfirmOverbook { get; set; } = false;
    public string? Notes { get; set; }
}
