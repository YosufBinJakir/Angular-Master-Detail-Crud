using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MasterDetailCrudApi.Models
{
    public enum Shift { Morning = 1, Day }
    public class Student
    {
        public int StudentId { get; set; }
        [Required, StringLength(40)]
        public string StudentName { get; set; } = default!;
        [Required, EnumDataType(typeof(Shift))]
        public Shift Shift { get; set; }
        [Required, Column(TypeName = "date")]
        public DateTime? BirthDate { get; set; }
        [Required, Column(TypeName = "money")]
        public decimal TutionFee { get; set; }
        [Required, StringLength(40)]
        public string Picture { get; set; } = default!;
        public bool IsPresent { get; set; }
        public virtual ICollection<Result> Results { get; set; } = new List<Result>();
    }
    public class Result
    {
        public int ResultId { get; set; }
        [Required, StringLength(40)]
        public string ExamName { get; set; } = default!;
        [Required, StringLength(40)]
        public string Gpa { get; set; } = default!;
        [Required, ForeignKey("Student")]
        public int StudentId { get; set; }
        public virtual Student? Student { get; set; } = default!;
    }

    public class StudentDbContext : DbContext
    {
        public StudentDbContext(DbContextOptions<StudentDbContext> options) : base(options) { }
        public DbSet<Student> Students { get; set; } = default!;
        public DbSet<Result> Results { get; set; } = default!;

    }

}
