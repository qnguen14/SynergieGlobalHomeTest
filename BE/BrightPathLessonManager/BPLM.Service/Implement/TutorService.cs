using BPLM.Domain.Entities;
using BPLM.Repository.Interface;
using BPLM.Service.Interface;

namespace BPLM.Service.Implement;

public class TutorService : ITutorService
{
    private readonly ITutorRepository _tutorRepository;

    public TutorService(ITutorRepository tutorRepository)
    {
        _tutorRepository = tutorRepository;
    }

    public async Task<IEnumerable<Tutor>> GetAllTutorsAsync()
    {
        return await _tutorRepository.GetAllAsync();
    }

    public async Task<Tutor?> GetTutorByIdAsync(string tutorId)
    {
        return await _tutorRepository.GetByIdAsync(tutorId);
    }

    public async Task<Tutor> CreateTutorAsync(Tutor tutor)
    {
        return await _tutorRepository.AddAsync(tutor);
    }

    public async Task<Tutor> UpdateTutorAsync(Tutor tutor)
    {
        return await _tutorRepository.UpdateAsync(tutor);
    }

    public async Task<bool> DeleteTutorAsync(string tutorId)
    {
        return await _tutorRepository.DeleteAsync(tutorId);
    }
}
