using BPLM.Domain.DTO.Lesson;
using BPLM.Domain.Entities;
using BPLM.Repository.Interface;
using BPLM.Service.Interface;

namespace BPLM.Service.Implement;

public class LessonService : ILessonService
{
    private readonly ILessonRepository _lessonRepository;

    public LessonService(ILessonRepository lessonRepository)
    {
        _lessonRepository = lessonRepository;
    }

    public async Task<IEnumerable<Lesson>> GetLessonsAsync(DateOnly? date = null)
    {
        var targetDate = date ?? DateOnly.FromDateTime(DateTime.Today);
        var lessons = await _lessonRepository.GetAllAsync();

        return lessons
            .Where(l => l.Date == targetDate)
            .OrderBy(l => l.Date)
            .ThenBy(l => l.StartTime);
    }

    public async Task<IEnumerable<Lesson>> GetAllLessonsAsync()
    {
        var lessons = await _lessonRepository.GetAllAsync();

        return lessons
            .OrderBy(l => l.Date)
            .ThenBy(l => l.StartTime);
    }

    public async Task<Lesson?> GetLessonByIdAsync(string lessonId)
    {
        return await _lessonRepository.GetByIdAsync(lessonId);
    }

    public async Task<Lesson> CreateLessonAsync(CreateLessonRequest request)
    {
        var lesson = new Lesson
        {
            LessonID = $"LES-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
            Date = request.Date,
            StartTime = request.StartTime,
            DurationMin = request.DurationMin,
            Student = request.Student,
            TutorID = request.TutorID,
            Room = request.Room,
            Status = LessonStatus.Booked,
            IsExam = request.IsExam,
            Notes = request.Notes
        };

        return await _lessonRepository.AddAsync(lesson);
    }

    public async Task<Lesson?> UpdateLessonAsync(string lessonId, UpdateLessonRequest request)
    {
        var existingLesson = await _lessonRepository.GetByIdAsync(lessonId);
        if (existingLesson == null) return null;

        existingLesson.Date = request.Date;
        existingLesson.StartTime = request.StartTime;
        existingLesson.DurationMin = request.DurationMin;
        existingLesson.Student = request.Student;
        existingLesson.TutorID = request.TutorID;
        existingLesson.Room = request.Room;
        existingLesson.IsExam = request.IsExam;
        if (request.Notes != null)
        {
            existingLesson.Notes = request.Notes;
        }

        return await _lessonRepository.UpdateAsync(existingLesson);
    }

    public async Task<Lesson?> CancelLessonAsync(string lessonId, CancelLessonRequest request)
    {
        var existingLesson = await _lessonRepository.GetByIdAsync(lessonId);
        if (existingLesson == null) return null;

        existingLesson.Status = LessonStatus.Cancelled;
        existingLesson.CancelledAt = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(request.Notes))
        {
            existingLesson.Notes = string.IsNullOrWhiteSpace(existingLesson.Notes)
                ? request.Notes
                : $"{existingLesson.Notes} | Cancel Notes: {request.Notes}";
        }

        return await _lessonRepository.UpdateAsync(existingLesson);
    }

    public async Task<Lesson?> ToggleExamAsync(string lessonId)
    {
        var existingLesson = await _lessonRepository.GetByIdAsync(lessonId);
        if (existingLesson == null) return null;

        existingLesson.IsExam = !existingLesson.IsExam;

        return await _lessonRepository.UpdateAsync(existingLesson);
    }

    public async Task<bool> DeleteLessonAsync(string lessonId)
    {
        return await _lessonRepository.DeleteAsync(lessonId);
    }
}
