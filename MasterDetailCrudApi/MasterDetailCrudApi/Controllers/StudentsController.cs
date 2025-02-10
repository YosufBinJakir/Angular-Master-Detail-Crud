using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterDetailCrudApi.Models;
using MasterDetailCrudApi.ViewModels;

namespace Ev_Mid_09_Work_01.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly StudentDbContext _context;
        private readonly IWebHostEnvironment _env;
        public StudentsController(StudentDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.Include(x=>x.Results).ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudentById(int id)
        {
            var student = await _context.Students.Include(x=> x.Results).FirstOrDefaultAsync(x=> x.StudentId == id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }
        [HttpGet("Results/Of/{id}")]
        public async Task<ActionResult<IEnumerable<Result>>> GetResultOfStudents(int id)
        {
            return await _context.Results.Where(x=> x.StudentId == id).ToListAsync();
        }
       
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, Student student)
        {
            if (id != student.StudentId)
            {
                return BadRequest();
            }
            var existing = await _context.Students.FirstOrDefaultAsync(x=> x.StudentId == id);
            if(existing == null) { return NotFound(); }
            existing.StudentName = student.StudentName;
            existing.StudentId = student.StudentId;
            existing.Shift= student.Shift;
            existing.BirthDate = student.BirthDate;
            existing.TutionFee = student.TutionFee;
            existing.IsPresent = student.IsPresent;
            existing.Picture = student.Picture;
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM Results WHERE StudentId={id}");
            foreach (var result in student.Results)
            {
                _context.Results.Add(new Result { ExamName=result.ExamName, StudentId=id, Gpa=result.Gpa }); 
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Devices
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = student.StudentId }, student);
        }

        // DELETE: api/Devices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost("Image/Upload")]
        public async Task<ActionResult<ImageUploadResponse>> Upload(IFormFile pic)
        {
            string ext = Path.GetExtension(pic.FileName);
            string f = Path.GetFileNameWithoutExtension(Path.GetRandomFileName())+ext;
            string savePath = Path.Combine(_env.WebRootPath, "Pictures", f);
            FileStream fs = new FileStream(savePath, FileMode.Create);
            await pic.CopyToAsync(fs);
            fs.Close();
            return new ImageUploadResponse { NewFileName= f };
        }

        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.StudentId == id);
        }
    }
}
