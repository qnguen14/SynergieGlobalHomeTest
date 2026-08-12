using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BPLM.Domain.Entities;

public class Tutor
{
    [Key]
    [Required]
    [Column("tutor_id")]
    public string TutorId { get; set; }
    
    [Required]
    [Column("tutor_name")]
    public string TutorName { get; set; }
    
    [Required]
    [Column("subject")]
    public string Subject { get; set; }
    
    [Required]
    [Column("phone")]
    public string Phone { get; set; }
}