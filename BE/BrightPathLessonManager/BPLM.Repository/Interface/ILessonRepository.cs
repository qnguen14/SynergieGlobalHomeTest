using BPLM.Domain.Entities;

namespace BPLM.Repository.Interface;

public interface ILessonRepository
{
    Task<IEnumerable<Lesson>> GetAllAsync();
    Task<Lesson?> GetByIdAsync(string lessonId);
    Task<Lesson> AddAsync(Lesson lesson);
    Task<Lesson> UpdateAsync(Lesson lesson);
    Task<bool> DeleteAsync(string lessonId);
}
