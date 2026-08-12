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
        int currentCount = (await _lessonRepository.GetAllAsync())
            .Count(l => l.TutorID == request.TutorID && l.Date == request.Date && l.Status != LessonStatus.Cancelled);

        if (currentCount >= 6 && !request.ConfirmOverbook)
        {
            throw new InvalidOperationException($"Tutor '{request.TutorID}' already has {currentCount} active bookings on {request.Date}. Confirmation is required to exceed 6 bookings per day.");
        }

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

        int currentCount = (await _lessonRepository.GetAllAsync())
            .Count(l => l.LessonID != lessonId && l.TutorID == request.TutorID && l.Date == request.Date && l.Status != LessonStatus.Cancelled);

        if (currentCount >= 6 && !request.ConfirmOverbook)
        {
            throw new InvalidOperationException($"Tutor '{request.TutorID}' already has {currentCount} active bookings on {request.Date}. Confirmation is required to exceed 6 bookings per day.");
        }

        if (!request.IsExam && await WouldHaveTwoStudentsBookedAsync(lessonId, request))
        {
            throw new InvalidOperationException("Cannot set IsExam to false when two students are booked at the same time.");
        }

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

        bool targetIsExam = !existingLesson.IsExam;
        if (!targetIsExam && await HasTwoStudentsBookedAsync(existingLesson))
        {
            throw new InvalidOperationException("Cannot remove Exam status when two students are booked at the same time.");
        }

        existingLesson.IsExam = targetIsExam;

        return await _lessonRepository.UpdateAsync(existingLesson);
    }

    public async Task<bool> DeleteLessonAsync(string lessonId)
    {
        return await _lessonRepository.DeleteAsync(lessonId);
    }

    private async Task<bool> HasTwoStudentsBookedAsync(Lesson lesson)
    {
        if (HasMultipleStudentsInString(lesson.Student))
        {
            return true;
        }

        var allLessons = await _lessonRepository.GetAllAsync();
        return allLessons.Any(other =>
            other.LessonID != lesson.LessonID &&
            other.TutorID == lesson.TutorID &&
            other.Date == lesson.Date &&
            other.Status != LessonStatus.Cancelled &&
            IsTimeOverlapping(lesson.StartTime, lesson.DurationMin, other.StartTime, other.DurationMin));
    }

    private async Task<bool> WouldHaveTwoStudentsBookedAsync(string lessonId, UpdateLessonRequest request)
    {
        if (HasMultipleStudentsInString(request.Student))
        {
            return true;
        }

        var allLessons = await _lessonRepository.GetAllAsync();
        return allLessons.Any(other =>
            other.LessonID != lessonId &&
            other.TutorID == request.TutorID &&
            other.Date == request.Date &&
            other.Status != LessonStatus.Cancelled &&
            IsTimeOverlapping(request.StartTime, request.DurationMin, other.StartTime, other.DurationMin));
    }

    private static bool HasMultipleStudentsInString(string? studentField)
    {
        if (string.IsNullOrWhiteSpace(studentField)) return false;
        var names = studentField.Split(new[] { ',', '&', '/' }, StringSplitOptions.RemoveEmptyEntries);
        return names.Length > 1;
    }

    private static bool IsTimeOverlapping(TimeOnly start1, string duration1Str, TimeOnly start2, string duration2Str)
    {
        if (!int.TryParse(duration1Str, out int duration1)) duration1 = 60;
        if (!int.TryParse(duration2Str, out int duration2)) duration2 = 60;

        var end1 = start1.AddMinutes(duration1);
        var end2 = start2.AddMinutes(duration2);

        return start1 < end2 && start2 < end1;
    }
}
