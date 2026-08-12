using BPLM.Domain.Context;
using BPLM.Domain.Entities;
using BPLM.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace BPLM.Repository.Implement;

public class TutorRepository : ITutorRepository
{
    private readonly BPLMDbContext _context;

    public TutorRepository(BPLMDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Tutor>> GetAllAsync()
    {
        return await _context.Tutors.ToListAsync();
    }

    public async Task<Tutor?> GetByIdAsync(string tutorId)
    {
        return await _context.Tutors.FirstOrDefaultAsync(t => t.TutorId == tutorId);
    }

    public async Task<Tutor> AddAsync(Tutor tutor)
    {
        await _context.Tutors.AddAsync(tutor);
        await _context.SaveChangesAsync();
        return tutor;
    }

    public async Task<Tutor> UpdateAsync(Tutor tutor)
    {
        _context.Tutors.Update(tutor);
        await _context.SaveChangesAsync();
        return tutor;
    }

    public async Task<bool> DeleteAsync(string tutorId)
    {
        var tutor = await GetByIdAsync(tutorId);
        if (tutor == null) return false;

        _context.Tutors.Remove(tutor);
        await _context.SaveChangesAsync();
        return true;
    }
}
