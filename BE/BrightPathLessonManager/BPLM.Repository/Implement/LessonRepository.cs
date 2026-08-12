using BPLM.Domain.Context;
using BPLM.Domain.Entities;
using BPLM.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace BPLM.Repository.Implement;

public class LessonRepository : ILessonRepository
{
    private readonly BPLMDbContext _context;

    public LessonRepository(BPLMDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Lesson>> GetAllAsync()
    {
        return await _context.Lessons
            .Include(l => l.Tutor)
            .ToListAsync();
    }

    public async Task<Lesson?> GetByIdAsync(string lessonId)
    {
        return await _context.Lessons
            .Include(l => l.Tutor)
            .FirstOrDefaultAsync(l => l.LessonID == lessonId);
    }

    public async Task<Lesson> AddAsync(Lesson lesson)
    {
        await _context.Lessons.AddAsync(lesson);
        await _context.SaveChangesAsync();
        return lesson;
    }

    public async Task<Lesson> UpdateAsync(Lesson lesson)
    {
        _context.Lessons.Update(lesson);
        await _context.SaveChangesAsync();
        return lesson;
    }

    public async Task<bool> DeleteAsync(string lessonId)
    {
        var lesson = await _context.Lessons.FirstOrDefaultAsync(l => l.LessonID == lessonId);
        if (lesson == null) return false;

        _context.Lessons.Remove(lesson);
        await _context.SaveChangesAsync();
        return true;
    }
}
