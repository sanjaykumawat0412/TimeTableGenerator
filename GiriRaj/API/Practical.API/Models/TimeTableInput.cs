namespace Practical.API.Models
{
    public class TimeTableInput
    {
        public int WorkingDays { get; set; }
        public int SubjectsPerDay { get; set; }
        public int TotalSubjects { get; set; }
        public List<SubjectHours>? SubjectHours { get; set; }
    }

    public class SubjectHours
    {
        public string SubjectName { get; set; }
        public int Hours { get; set; }
    }
}
