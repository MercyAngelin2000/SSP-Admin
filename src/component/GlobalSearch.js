import React, { useContext, useState } from 'react';
import './GlobalSearch.css';
import { inputContext } from '../layout/DefaultLayout';
function GlobalSearch() {
    const inputContextObj = useContext(inputContext);
    const [content, setContent] = useState(1)
    const handleClose = () => {
        inputContextObj?.setInputObj()
    }
    const handleContentChange = (id) => {
        setContent(id)
    }
    const attendanceData = [
        { studentName: 'Emily', totalDays: 20, daysPresent: 18, daysAbsent: 2 },
        { studentName: 'James', totalDays: 20, daysPresent: 19, daysAbsent: 1 },
        { studentName: 'Sophia', totalDays: 20, daysPresent: 20, daysAbsent: 0 },
        { studentName: 'Oliver', totalDays: 20, daysPresent: 17, daysAbsent: 3 },
        { studentName: 'Ava', totalDays: 20, daysPresent: 16, daysAbsent: 4 }
    ];
    const feeData = [
        { studentName: 'Emily', class: '10', section: 'A', amountDue: '$200', status: 'Pending' },
        { studentName: 'James', class: '10', section: 'A', amountDue: '$0', status: 'Paid' },
        { studentName: 'Sophia', class: '10', section: 'B', amountDue: '$150', status: 'Pending' },
        { studentName: 'Oliver', class: '10', section: 'B', amountDue: '$0', status: 'Paid' },
        { studentName: 'Ava', class: '10', section: 'C', amountDue: '$100', status: 'Pending' }
    ];
    return (
        <div className='globalSearch'>
            <div className='d-flex justify-content-between align-items-center'>
                <h6 className='p-2 text-center text-muted'>Here's where you can view the result you searched for</h6>
                <span onClick={() => { handleClose() }} role='button' title='Back' className='text-primary'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                </svg></span>
            </div>
            <div className='d-flex card'>
                <div className='row global'>
                    <div className='col-lg-3 history'>
                        <div className='d-flex flex-column align-items-start p-3'>
                            <h6 className='small fw-bold '>Today</h6>
                            <ul className='list-unstyled'>
                                <li className={content === 1 ? 'mb-2 searchList text-primary' : 'mb-2 searchList'} onClick={() => { handleContentChange(1) }}>Show me Mercy's grades for the current semester</li>
                                <li className={content === 2 ? 'mb-2 searchList text-primary' : 'mb-2 searchList'} onClick={() => { handleContentChange(2) }}>List Mercy's upcoming assignments</li>
                            </ul>
                            <h6 className='small fw-bold '>Yesterday</h6>
                            <ul className='list-unstyled'>
                                <li className={content === 3 ? 'mb-2 searchList text-primary' : 'mb-2 searchList'} onClick={() => { handleContentChange(3) }}>View grades for all students in Class 8, Section B</li>
                                <li className={content === 4 ? 'mb-2 searchList text-primary' : 'mb-2 searchList'} onClick={() => { handleContentChange(4) }}>View attendance summary for Class 6, Section D</li>
                                <li className={content === 5 ? 'mb-2 searchList text-primary' : 'mb-2 searchList'} onClick={() => { handleContentChange(5) }}>View all pending fee payments.</li>
                                <li className={content === 6 ? 'mb-2 searchList text-primary' : 'mb-2 searchList'} onClick={() => { handleContentChange(6) }}>Post an announcement about the upcoming school trip.</li>
                                <li className={content === 7 ? 'mb-2 searchList text-primary' : 'mb-2 searchList'} onClick={() => { handleContentChange(7) }}>Check 10th Class attendance record for this month.</li>
                                <li className={content === 8 ? 'mb-2 searchList text-primary' : 'mb-2 searchList'} onClick={() => { handleContentChange(8) }}>Check the fee payment status for this term.</li>
                            </ul>
                        </div>
                    </div>
                    <div className='col-lg-9 searchContent'>
                        {
                            content === 1 ?
                                <div className="container mt-5">
                                    <h6 className="text-primary">Mercy's Grades - Current Semester</h6>
                                    <table className="table table-striped">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">Course</th>
                                                <th scope="col">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Mathematics</td>
                                                <td>A</td>
                                            </tr>
                                            <tr>
                                                <td>English Literature</td>
                                                <td>B+</td>
                                            </tr>
                                            <tr>
                                                <td>Biology</td>
                                                <td>A-</td>
                                            </tr>
                                            <tr>
                                                <td>History</td>
                                                <td>B</td>
                                            </tr>
                                            <tr>
                                                <td>Art</td>
                                                <td>A</td>
                                            </tr>
                                            <tr>
                                                <td>Physical Education</td>
                                                <td>B+</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                : content === 2 ?
                                    <div className="container mt-5">
                                        <h6 className="text-primary">Mercy's Upcoming Assignments</h6>
                                        <table className="table table-striped">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th scope="col">Course</th>
                                                    <th scope="col">Assignment</th>
                                                    <th scope="col">Due Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Mathematics</td>
                                                    <td>Algebra Homework</td>
                                                    <td>2024-06-25</td>
                                                </tr>
                                                <tr>
                                                    <td>English Literature</td>
                                                    <td>Essay on Shakespeare</td>
                                                    <td>2024-06-27</td>
                                                </tr>
                                                <tr>
                                                    <td>Biology</td>
                                                    <td>Lab Report</td>
                                                    <td>2024-06-29</td>
                                                </tr>
                                                <tr>
                                                    <td>History</td>
                                                    <td>World War II Presentation</td>
                                                    <td>2024-07-02</td>
                                                </tr>
                                                <tr>
                                                    <td>Art</td>
                                                    <td>Portrait Painting</td>
                                                    <td>2024-07-05</td>
                                                </tr>
                                                <tr>
                                                    <td>Physical Education</td>
                                                    <td>Fitness Plan</td>
                                                    <td>2024-07-07</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    : content === 3 ?
                                        <div className="container mt-5">
                                            <h6 className="text-primary">Grades for Class 8, Section B</h6>
                                            <table className="table table-striped">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th scope="col">Student Name</th>
                                                        <th scope="col">Mathematics</th>
                                                        <th scope="col">English Literature</th>
                                                        <th scope="col">Biology</th>
                                                        <th scope="col">History</th>
                                                        <th scope="col">Art</th>
                                                        <th scope="col">Physical Education</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Mercy</td>
                                                        <td>A</td>
                                                        <td>B+</td>
                                                        <td>A-</td>
                                                        <td>B</td>
                                                        <td>A</td>
                                                        <td>B+</td>
                                                    </tr>
                                                    <tr>
                                                        <td>John</td>
                                                        <td>B+</td>
                                                        <td>A</td>
                                                        <td>B</td>
                                                        <td>A-</td>
                                                        <td>B+</td>
                                                        <td>A</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Anna</td>
                                                        <td>A-</td>
                                                        <td>B</td>
                                                        <td>A</td>
                                                        <td>B+</td>
                                                        <td>A</td>
                                                        <td>B</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Michael</td>
                                                        <td>B</td>
                                                        <td>B+</td>
                                                        <td>A</td>
                                                        <td>A</td>
                                                        <td>A-</td>
                                                        <td>A</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Lucy</td>
                                                        <td>A</td>
                                                        <td>A-</td>
                                                        <td>B+</td>
                                                        <td>B</td>
                                                        <td>B+</td>
                                                        <td>A-</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        : content === 4 ?
                                            <div className="container mt-5">
                                                <h6 className="text-primary">Attendance Summary for Class 6, Section D</h6>
                                                <table className="table table-striped">
                                                    <thead className="thead-dark">
                                                        <tr>
                                                            <th scope="col">Student Name</th>
                                                            <th scope="col">Total Days</th>
                                                            <th scope="col">Days Present</th>
                                                            <th scope="col">Days Absent</th>
                                                            <th scope="col">Attendance Percentage</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Emily</td>
                                                            <td>100</td>
                                                            <td>95</td>
                                                            <td>5</td>
                                                            <td>95%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>James</td>
                                                            <td>100</td>
                                                            <td>90</td>
                                                            <td>10</td>
                                                            <td>90%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Sophia</td>
                                                            <td>100</td>
                                                            <td>98</td>
                                                            <td>2</td>
                                                            <td>98%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Oliver</td>
                                                            <td>100</td>
                                                            <td>92</td>
                                                            <td>8</td>
                                                            <td>92%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Ava</td>
                                                            <td>100</td>
                                                            <td>97</td>
                                                            <td>3</td>
                                                            <td>97%</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            : content === 5 ?
                                                <div className="container mt-5">
                                                    <h6 className="text-primary">Pending Fee Payments</h6>
                                                    <table className="table table-striped">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th scope="col">Student Name</th>
                                                                <th scope="col">Class</th>
                                                                <th scope="col">Section</th>
                                                                <th scope="col">Amount Due</th>
                                                                <th scope="col">Due Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Mercy</td>
                                                                <td>8</td>
                                                                <td>B</td>
                                                                <td>$500</td>
                                                                <td>2024-06-30</td>
                                                            </tr>
                                                            <tr>
                                                                <td>John</td>
                                                                <td>10</td>
                                                                <td>A</td>
                                                                <td>$450</td>
                                                                <td>2024-06-28</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Anna</td>
                                                                <td>9</td>
                                                                <td>C</td>
                                                                <td>$400</td>
                                                                <td>2024-06-27</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Michael</td>
                                                                <td>7</td>
                                                                <td>D</td>
                                                                <td>$550</td>
                                                                <td>2024-07-01</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Lucy</td>
                                                                <td>6</td>
                                                                <td>B</td>
                                                                <td>$600</td>
                                                                <td>2024-06-25</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                : content === 6 ?
                                                    <div className="container mt-5">
                                                        <div className="card">
                                                            <div className="card-header bg-primary text-white">
                                                                <h3 className="card-title">Upcoming School Trip Announcement</h3>
                                                            </div>
                                                            <div className="card-body">
                                                                <p className="card-text">
                                                                    Dear Students and Parents,<br />
                                                                    We are excited to announce an upcoming school trip to [Destination].
                                                                    This trip will be a fantastic opportunity for students to [describe the purpose of the trip and any activities planned].
                                                                    Please mark your calendars and stay tuned for more details regarding the itinerary and required permissions.<br />
                                                                    Date: [Trip Date]<br />
                                                                    Location: [Destination]<br />
                                                                    We look forward to an enriching experience together!<br />
                                                                    Sincerely,<br />
                                                                    [Your School Name]
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : content === 7 ?
                                                        <div className="container mt-5">
                                                            <h6 className="text-primary">10th Class Attendance Record for This Month</h6>
                                                            <table className="table table-striped">
                                                                <thead className="thead-dark">
                                                                    <tr>
                                                                        <th scope="col">Student Name</th>
                                                                        <th scope="col">Total Days</th>
                                                                        <th scope="col">Days Present</th>
                                                                        <th scope="col">Days Absent</th>
                                                                        <th scope="col">Attendance Percentage</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {attendanceData.map((record, index) => (
                                                                        <tr key={index}>
                                                                            <td>{record.studentName}</td>
                                                                            <td>{record.totalDays}</td>
                                                                            <td>{record.daysPresent}</td>
                                                                            <td>{record.daysAbsent}</td>
                                                                            <td>{((record.daysPresent / record.totalDays) * 100).toFixed(2)}%</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        : content === 8 ?
                                                            <div className="container mt-5">
                                                                <h6 className="text-primary">Fee Payment Status for This Term</h6>
                                                                <table className="table table-striped">
                                                                    <thead className="thead-dark">
                                                                        <tr>
                                                                            <th scope="col">Student Name</th>
                                                                            <th scope="col">Class</th>
                                                                            <th scope="col">Section</th>
                                                                            <th scope="col">Amount Due</th>
                                                                            <th scope="col">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {feeData.map((record, index) => (
                                                                            <tr key={index}>
                                                                                <td>{record.studentName}</td>
                                                                                <td>{record.class}</td>
                                                                                <td>{record.section}</td>
                                                                                <td>{record.amountDue}</td>
                                                                                <td>{record.status}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div> : null
                        }

                    </div>
                </div>
            </div>
            <div className="p-4 d-flex justify-content-center fixed-bottom">
                <div class="input-group w-75 input-group-sm searchGroup">
                    <input type='text' className="form-control" placeholder='Search...' aria-label="Username" aria-describedby="basic-addon1" />
                    <button class="btn text-primary" type="button" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GlobalSearch;