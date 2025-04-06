using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Practical.API.Models;

namespace Practical.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeTableController : ControllerBase
    {
        [HttpPost("generate")]
        public IActionResult GenerateTimeTable([FromBody] TimeTableInput input)
        {
            int totalHours = input.WorkingDays * input.SubjectsPerDay;
            if (input.SubjectHours.Sum(s => s.Hours) != totalHours)
                return BadRequest("Total subject hours must match total hours per week!");
            List<List<string>> timetable = GenerateTimetable(input);
            return Ok(timetable);
        }

        private List<List<string>> GenerateTimetable(TimeTableInput input)
        {
            List<string> subjects = new List<string>();
            foreach (var sub in input.SubjectHours)
                subjects.AddRange(Enumerable.Repeat(sub.SubjectName, sub.Hours));
            subjects = subjects.OrderBy(_ => new Random().Next()).ToList();
            List<List<string>> timetable = new List<List<string>>();
            for (int i = 0; i < input.SubjectsPerDay; i++)
            {
                List<string> row = new List<string>();
                for (int j = 0; j < input.WorkingDays; j++)
                    row.Add(subjects[i * input.WorkingDays + j]);
                timetable.Add(row);
            }
            return timetable;
        }
    }
}
