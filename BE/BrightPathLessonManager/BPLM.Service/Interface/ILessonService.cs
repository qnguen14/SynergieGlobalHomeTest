using BPLM.Domain.DTO.Lesson;
using BPLM.Domain.Entities;

namespace BPLM.Service.Interface;

public interface ILessonService
{
    Task<IEnumerable<Lesson>> GetLessonsAsync(DateOnly? date = null);
    Task<IEnumerable<Lesson>> GetAllLessonsAsync();
    Task<Lesson?> GetLessonByIdAsync(string lessonId);
    Task<Lesson> CreateLessonAsync(CreateLessonRequest request);
    Task<Lesson?> UpdateLessonAsync(string lessonId, UpdateLessonRequest request);
    Task<Lesson?> CancelLessonAsync(string lessonId, CancelLessonRequest request);
    Task<Lesson?> ToggleExamAsync(string lessonId);
    Task<bool> DeleteLessonAsync(string lessonId);
}
