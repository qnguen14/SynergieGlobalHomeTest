using BPLM.Domain.Entities;

namespace BPLM.Service.Interface;

public interface ITutorService
{
    Task<IEnumerable<Tutor>> GetAllTutorsAsync();
    Task<Tutor?> GetTutorByIdAsync(string tutorId);
    Task<Tutor> CreateTutorAsync(Tutor tutor);
    Task<Tutor> UpdateTutorAsync(Tutor tutor);
    Task<bool> DeleteTutorAsync(string tutorId);
}
