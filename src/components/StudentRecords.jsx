import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios for API requests
import StudentDetails from './StudentDetails';
import './StudentRecords.css';
import '../styles/common.css';

const StudentRecords = ({onStudentClick}) => {
  // State for student records, search and filter
  const [studentRecords, setStudentRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(true); // To show a loading state while fetching data
  const [error, setError] = useState(null); // To handle any errors during fetch
  const [selectedStudent, setSelectedStudent] = useState(null); // To track selected student for details view
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card' view mode

  // Function to determine risk level based on probability
  const getRiskLevel = (probability) => {
    if (probability < 30) return 'Low';
    if (probability >= 30 && probability <= 40) return 'Medium';
    return 'High';
  };

  // Function to get risk percentage for visualization
  const getRiskPercentage = (riskScore) => {
    switch(riskScore) {
      case 'Low': return '30%';
      case 'Medium': return '60%';
      case 'High': return '90%';
      default: return '0%';
    }
  };

  // Function to get risk color
  const getRiskColor = (riskScore) => {
    switch(riskScore) {
      case 'Low': return '#48BB78';
      case 'Medium': return '#ED8936';
      case 'High': return '#E53E3E';
      default: return '#CBD5E0';
    }
  };

  // State to store complete student data with semesters and subjects
  const [completeStudentData, setCompleteStudentData] = useState({});

  // Function to calculate average attendance for a student
  const calculateAttendance = (studentId) => {
    if (!completeStudentData[studentId] || !completeStudentData[studentId].semesters) {
      return 75; // Default value if data not available
    }

    const student = completeStudentData[studentId];
    let totalAttendance = 0;
    let subjectCount = 0;

    student.semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        totalAttendance += subject.attendance;
        subjectCount++;
      });
    });

    return subjectCount > 0 ? Math.round(totalAttendance / subjectCount) : 75;
  };

  // Function to calculate average performance (marks) for a student
  const calculatePerformance = (studentId) => {
    if (!completeStudentData[studentId] || !completeStudentData[studentId].semesters) {
      return 70; // Default value if data not available
    }

    const student = completeStudentData[studentId];
    let totalMarks = 0;
    let subjectCount = 0;

    student.semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        totalMarks += subject.marks;
        subjectCount++;
      });
    });

    return subjectCount > 0 ? Math.round(totalMarks / subjectCount) : 70;
  };

  // Function to calculate CGPA for a student
  const calculateCGPA = (studentId) => {
    if (!completeStudentData[studentId] || !completeStudentData[studentId].semesters) {
      return 7.5; // Default value if data not available
    }

    const student = completeStudentData[studentId];
    let totalGradePoints = 0;
    let subjectCount = 0;

    student.semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        // Convert marks to grade points (10-point scale)
        let gradePoint = 0;
        if (subject.marks >= 90) gradePoint = 10;
        else if (subject.marks >= 80) gradePoint = 9;
        else if (subject.marks >= 70) gradePoint = 8;
        else if (subject.marks >= 60) gradePoint = 7;
        else if (subject.marks >= 50) gradePoint = 6;
        else if (subject.marks >= 40) gradePoint = 5;
        else gradePoint = 4;

        totalGradePoints += gradePoint;
        subjectCount++;
      });
    });

    return subjectCount > 0 ? (totalGradePoints / subjectCount).toFixed(1) : 7.5;
  };

  // Mock data for testing
  const mockStudentData = [
    {
      _id: "681e52775aaf8ea9addea9f3",
      name: "Aarav Sharma",
      usn: "1RV20CS001",
      gender: "Male",
      extracurricular: "1",
      current_sem: 4,
      probability: 0.03174,
      dropout_probability: 40,
      dropout_reason: "The dropout probability for Aarav Sharma is relatively moderate at 40%. This is due to a slight decline in his academic performance and attendance in Semester 2 compared to Semester 1. The decrease in marks in subjects like Data Structures and Digital Electronics, along with a decrease in attendance, could indicate a potential lack of interest or motivation in those subjects.",
      dropout_suggestions: "1. Aarav should consider seeking help from professors or tutors for subjects where he is struggling, such as Data Structures and Digital Electronics. This will help him improve his understanding and performance in these areas.\n2. Aarav should work on improving his attendance in all subjects to ensure he is fully engaged in his studies and not missing out on important information.\n3. Engaging in extracurricular activities at a higher level could also help Aarav stay motivated and balanced, leading to better overall performance in his academics.",
      semesters: [
        {
          semester_number: 1,
          subjects: [
            { name: "Mathematics-I", marks: 98, attendance: 93 },
            { name: "Physics", marks: 61, attendance: 81 },
            { name: "Chemistry", marks: 91, attendance: 74 },
            { name: "Basic Electronics", marks: 47, attendance: 91 },
            { name: "Computer Programming", marks: 88, attendance: 92 }
          ]
        },
        {
          semester_number: 2,
          subjects: [
            { name: "Mathematics-II", marks: 100, attendance: 80 },
            { name: "Data Structures", marks: 52, attendance: 60 },
            { name: "Digital Electronics", marks: 51, attendance: 83 },
            { name: "Object-Oriented Programming", marks: 86, attendance: 79 },
            { name: "Communication Skills", marks: 77, attendance: 73 }
          ]
        }
      ]
    },
    {
      _id: "681e52775aaf8ea9addeaa27",
      name: "Aryan Verma",
      usn: "1RV20CS005",
      gender: "Male",
      extracurricular: "2",
      current_sem: 4,
      probability: 0.025420000000000026,
      dropout_probability: 40,
      dropout_reason: "Aryan Verma has shown a decline in performance in Semester 2 compared to Semester 1, particularly in technical subjects.",
      dropout_suggestions: "1. Aryan should reflect on his performance in Semester 2 and identify specific areas where he needs improvement.",
      semesters: [
        {
          semester_number: 1,
          subjects: [
            { name: "Mathematics-I", marks: 85, attendance: 90 },
            { name: "Physics", marks: 78, attendance: 85 },
            { name: "Chemistry", marks: 82, attendance: 88 },
            { name: "Basic Electronics", marks: 75, attendance: 92 },
            { name: "Computer Programming", marks: 90, attendance: 95 }
          ]
        },
        {
          semester_number: 2,
          subjects: [
            { name: "Mathematics-II", marks: 72, attendance: 80 },
            { name: "Data Structures", marks: 65, attendance: 75 },
            { name: "Digital Electronics", marks: 68, attendance: 78 },
            { name: "Object-Oriented Programming", marks: 70, attendance: 82 },
            { name: "Communication Skills", marks: 85, attendance: 88 }
          ]
        }
      ]
    }
  ];

  // Fetch student records from backend API when the component mounts
  useEffect(() => {
    const fetchStudentRecords = async () => {
      try {
        // Try to fetch from API
        let studentData = [];
        try {
          const response = await axios.get('http://localhost:4500/api/vi/student');
          studentData = response.data;
        } catch (apiError) {
          console.warn('API fetch failed, using mock data:', apiError);
          studentData = mockStudentData;
        }

        // Store complete student data in a lookup object by ID
        const studentDataById = {};
        studentData.forEach(student => {
          studentDataById[student._id] = student;
        });

        // Set the complete student data
        setCompleteStudentData(studentDataById);

        // Map response data to match frontend expectations
        const mappedRecords = studentData.map(student => ({
          id: student._id,
          usn: student.usn,
          name: student.name,
          semester: student.current_sem,
          riskScore: getRiskLevel(student.dropout_probability || (student.probability * 100)), // Calculate risk based on probability
          // Include the complete student data for reference
          fullData: student
        }));

        setStudentRecords(mappedRecords);
        setLoading(false); // Data has been loaded
      } catch (err) {
        console.error('Error processing student data:', err);
        setError('Error loading student data.');
        setLoading(false); // Error occurred, stop loading
      }
    };

    fetchStudentRecords();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle semester filter change
  const handleSemesterFilterChange = (e) => {
    setSemesterFilter(e.target.value);
  };

  // Handle risk filter change
  const handleRiskFilterChange = (e) => {
    setRiskFilter(e.target.value);
  };

  // Filter students based on search term and filters
  const filteredStudents = studentRecords.filter(student => {
    // Search term filter
    const matchesSearch = searchTerm === '' ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.usn.toLowerCase().includes(searchTerm.toLowerCase());

    // Semester filter
    const matchesSemester = semesterFilter === '' ||
      student.semester.toString() === semesterFilter;

    // Risk filter
    const matchesRisk = riskFilter === '' ||
      student.riskScore === riskFilter;

    return matchesSearch && matchesSemester && matchesRisk;
  });

  return (
    <div className="student-records-container">
      {selectedStudent ? (
        <div className="student-details-view">
          <button
            className="back-to-list-button"
            onClick={() => setSelectedStudent(null)}
          >
            ← Back to Student List
          </button>
          <StudentDetails studentId={selectedStudent} onBack={() => setSelectedStudent(null)} />
        </div>
      ) : (
        <>
          <div className="student-records-header">
            <h1>Student Records</h1>
            <p>View and analyze student dropout risk predictions</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="search-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or USN..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="filter-box">
              <select
                value={semesterFilter}
                onChange={handleSemesterFilterChange}
                className="filter-select"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            <div className="filter-box">
              <select
                value={riskFilter}
                onChange={handleRiskFilterChange}
                className="filter-select"
              >
                <option value="">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <span className="view-icon">📋</span> List
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
              >
                <span className="view-icon">🃏</span> Cards
              </button>
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && <div className="loading-spinner"></div>}

          {/* Error Handling */}
          {error && <div className="error-message">{error}</div>}

          {/* Results Count */}
          <div className="results-count">
            Showing <span className="count-highlight">{filteredStudents.length}</span> students
          </div>

          {/* Student Records View (Table or Cards) */}
          {viewMode === 'list' ? (
            <div className="records-table-container">
              <div className="records-table-header">
                <div>USN</div>
                <div>Name</div>
                <div>Semester</div>
                <div>Risk Status</div>
              </div>
              <div>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="student-row"
                      onClick={() => {
                        // Use the prop if provided, otherwise use local state
                        if (onStudentClick) {
                          onStudentClick(student.id);
                        } else {
                          setSelectedStudent(student.id);
                        }
                      }}
                    >
                      <div className="student-usn">{student.usn}</div>
                      <div className="student-name">{student.name}</div>
                      <div className="student-semester">{student.semester}</div>
                      <div>
                        <span className={`risk-badge ${student.riskScore.toLowerCase()}`}>
                          {student.riskScore}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-records">
                    No students match your search criteria
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="student-cards-container">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`student-card ${student.riskScore.toLowerCase()}-risk`}
                    style={{
                      animationDelay: `${filteredStudents.indexOf(student) * 0.05}s`
                    }}
                    onClick={() => {
                      // Use the prop if provided, otherwise use local state
                      if (onStudentClick) {
                        onStudentClick(student.id);
                      } else {
                        setSelectedStudent(student.id);
                      }
                    }}
                  >
                    <div className="card-risk-indicator">
                      <div className="risk-meter">
                        <div
                          className="risk-fill"
                          style={{
                            width: getRiskPercentage(student.riskScore),
                            backgroundColor: getRiskColor(student.riskScore)
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="student-card-avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="student-card-info">
                      <h3 className="student-card-name">{student.name}</h3>
                      <div className="student-card-usn">{student.usn}</div>

                      <div className="card-data-visualization">
                        <div className="mini-chart">
                          <div className="chart-label">Attendance</div>
                          <div className="chart-bar-container">
                            <div
                              className="chart-bar attendance-bar"
                              style={{ height: `${calculateAttendance(student.id)}%` }}
                            ></div>
                          </div>
                          <div className="chart-value">{calculateAttendance(student.id)}%</div>
                        </div>

                        <div className="mini-chart">
                          <div className="chart-label">Performance</div>
                          <div className="chart-bar-container">
                            <div
                              className="chart-bar performance-bar"
                              style={{ height: `${calculatePerformance(student.id)}%` }}
                            ></div>
                          </div>
                          <div className="chart-value">{calculatePerformance(student.id)}%</div>
                        </div>

                        <div className="mini-chart">
                          <div className="chart-label">CGPA</div>
                          <div className="radial-progress">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                              <defs>
                                <linearGradient id={`gradientStroke-${student.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#3182ce" />
                                  <stop offset="100%" stopColor="#63b3ed" />
                                </linearGradient>
                              </defs>
                              <path
                                className="circle-bg"
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="circle"
                                strokeDasharray={`${calculateCGPA(student.id) * 10}, 100`}
                                stroke={`url(#gradientStroke-${student.id})`}
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <text x="18" y="20.35" className="percentage">{calculateCGPA(student.id)}</text>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="student-card-details">
                        <div className="student-card-semester">
                          <span className="detail-label">Semester:</span>
                          <span className="detail-value">{student.semester}</span>
                        </div>
                        <div className="student-card-risk">
                          <span className="detail-label">Risk:</span>
                          <span className={`risk-badge ${student.riskScore.toLowerCase()}`}>
                            {student.riskScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-records">
                  No students match your search criteria
                </div>
              )}
            </div>
          )}

          {/* Summary Statistics */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-label">Total Students</div>
              <div className="stat-value total">{filteredStudents.length}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">High Risk Students</div>
              <div className="stat-value high">
                {filteredStudents.filter(s => s.riskScore === 'High').length}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Medium Risk Students</div>
              <div className="stat-value medium">
                {filteredStudents.filter(s => s.riskScore === 'Medium').length}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Low Risk Students</div>
              <div className="stat-value low">
                {filteredStudents.filter(s => s.riskScore === 'Low').length}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentRecords;
