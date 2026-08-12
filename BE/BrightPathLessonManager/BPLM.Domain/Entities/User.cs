using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BPLM.Domain.Entities;

public class User
{
    [Key]
    [Required]
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [Required]
    [Column("full_name")]
    public string FullName { get; set; }
    
    [Required]
    [Column("email")]
    public string Email { get; set; }
    
    [Required]
    [Column("password")]
    public string Password { get; set; }
}