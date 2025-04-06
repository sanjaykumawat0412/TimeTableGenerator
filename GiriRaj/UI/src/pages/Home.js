
import axios from "axios";
import react, { Component } from "react";

export class Home extends Component {
    state = {
        workingDays: '',
        subjectsPerDay: '',
        totalSubjects: '',
        subjects: [],
        timetable: []
    };
    handleChange = (e) => {
        //debugger;
        if (e.target.name === 'workingDays' && (Number(e.target.value) >= 0 && Number(e.target.value) <= 7)) {
            this.setState({ [e.target.name]: Number(e.target.value) });
        } else if (e.target.name === 'subjectsPerDay' && (Number(e.target.value) >= 0 && Number(e.target.value) < 9)) {
            this.setState({ [e.target.name]: Number(e.target.value) });
        } else if (e.target.name === 'totalSubjects' && Number(e.target.value) >= 0) {
            this.setState({ [e.target.name]: Number(e.target.value) });
        } else {
            if (e.target.name === "workingDays") {
                alert("⚠️ Please enter working days between 1 and 7.")
            }
            if (e.target.name === "subjectsPerDay") {
                alert(" ⚠️ Please enter subjects per day between 1 and 8.")
            }
            if (e.target.name === "totalSubjects") {
                alert("⚠️ Please enter a positive number for total subjects.")
            }
            this.setState({ [e.target.name]: '' });
        }
    }

    handleSubmit = () => {
        //debugger
        const { workingDays, subjectsPerDay, totalSubjects } = this.state;
        let subjects = Array.from({ length: totalSubjects }, (_, i) => ({
            name: `Subject ${i
                + 1}`, hours: 0
        }));
        this.setState({ subjects, totalHours: workingDays * subjectsPerDay });
    };
    handleNameChange = (index, e) => {
        //debugger
        let subjects = [...this.state.subjects];
        subjects[index].name = e.target.value;
        this.setState({ subjects });
    };

    handleHoursChange = (index, e) => {
        //debugger;
        let subjects = [...this.state.subjects];
        subjects[index].hours = Number(e.target.value);
        this.setState({ subjects });
    };

    generateTimeTable = () => {
        //debugger
        axios.post("https://localhost:7241/api/TimeTable/generate", {
            workingDays: this.state.workingDays,
            subjectsPerDay: this.state.subjectsPerDay,
            totalSubjects: this.state.subjects.length,
            subjectHours: this.state.subjects.map(sub => ({
                subjectName: sub.name, Hours:
                    sub.hours
            }))
        })
            .then(res => this.setState({ timetable: res.data }))
            .catch(err => alert(err.response.data));
    };
    render() {
        return (
            <div className="container mt-5">
                <div className="card shadow p-4">
                    <h2 className="mb-4 text-center">Dynamic Time-Table Generator</h2>

                    <div className="row mb-3">
                        <div className="col-md-4 mb-2">
                            <label> Working Days</label>
                            <input
                                type="number"
                                name="workingDays"
                                className="form-control"
                                onChange={this.handleChange}
                                placeholder="Working Days"
                                min="1"
                                max="7"
                                value={this.state.workingDays}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <label> Subjects PerDay</label>
                            <input
                                type="number"
                                name="subjectsPerDay"
                                className="form-control"
                                onChange={this.handleChange}
                                placeholder="Subjects per Day"
                                value={this.state.subjectsPerDay}
                                min="1"
                                max="8"
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <label> total Subjects</label>
                            <input
                                type="number"
                                name="totalSubjects"
                                className="form-control"
                                onChange={this.handleChange}
                                placeholder="Total Subjects"
                                value={this.state.totalSubjects}
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="mb-3 text-center">
                        <button className="btn btn-primary" onClick={this.handleSubmit}>
                            Next
                        </button>
                    </div>

                    {this.state.subjects.length > 0 && (
                        <div className="mb-4">
                            <h5 className="mb-3">Enter Hours for Each Subject:</h5>
                            {this.state.subjects.map((sub, index) => (
                                <div className="row mb-2" key={index}>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Subject ${index + 1} Name`}
                                            value={sub.name}
                                            onChange={(e) => this.handleNameChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Hours"
                                            value={sub.hours}
                                            onChange={(e) => this.handleHoursChange(index, e)}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="text-center">
                                <button className="btn btn-success" onClick={this.generateTimeTable}>
                                    Generate TimeTable
                                </button>
                            </div>
                        </div>
                    )}

                    {this.state.timetable.length > 0 && (
                        <div>
                            <h5 className="text-center mb-3">Generated TimeTable</h5>
                            <div className="table-responsive">
                                <table className="table table-bordered text-center">
                                    <tbody>
                                        {this.state.timetable.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((subject, j) => (
                                                    <td key={j}>{subject}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        );
    }
}