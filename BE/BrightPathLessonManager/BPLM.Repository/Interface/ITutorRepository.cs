using BPLM.Domain.Entities;

namespace BPLM.Repository.Interface;

public interface ITutorRepository
{
    Task<IEnumerable<Tutor>> GetAllAsync();
    Task<Tutor?> GetByIdAsync(string tutorId);
    Task<Tutor> AddAsync(Tutor tutor);
    Task<Tutor> UpdateAsync(Tutor tutor);
    Task<bool> DeleteAsync(string tutorId);
}
