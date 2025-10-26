"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import API_BASE_URL from "../config/api.js"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
} from "recharts"
import "./GeneralDashboard.css"

const GeneralDashboard = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/vi/student`)
        setStudents(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch data. Please check if the API is running.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // For demo purposes, if API fails, use sample data
  useEffect(() => {
    if (error) {
      // Sample data from the attachment
      const sampleData = [
        {
          _id: "681e52775aaf8ea9addea9f3",
          name: "Aarav Sharma",
          usn: "1RV20CS001",
          gender: "Male",
          extracurricular: "1",
          current_sem: 4,
          probability: 0.03174,
          dropout_probability: 40,
          dropout_reason: "The dropout probability for Aarav Sharma is relatively moderate at 40%...",
          dropout_suggestions: "1. Aarav should consider seeking help from professors or tutors...",
          semesters: [
            {
              semester_number: 1,
              subjects: [
                { name: "Mathematics-I", marks: 98, attendance: 93 },
                { name: "Physics", marks: 61, attendance: 81 },
                { name: "Chemistry", marks: 91, attendance: 74 },
                { name: "Basic Electronics", marks: 47, attendance: 91 },
                { name: "Computer Programming", marks: 88, attendance: 92 },
              ],
            },
            {
              semester_number: 2,
              subjects: [
                { name: "Mathematics-II", marks: 100, attendance: 80 },
                { name: "Data Structures", marks: 52, attendance: 60 },
                { name: "Digital Electronics", marks: 51, attendance: 83 },
                { name: "Object-Oriented Programming", marks: 86, attendance: 79 },
                { name: "Communication Skills", marks: 77, attendance: 73 },
              ],
            },
          ],
        },
        {
          _id: "681e52775aaf8ea9addeaa00",
          name: "Vivaan Patel",
          usn: "1RV20CS002",
          gender: "Male",
          extracurricular: "8",
          current_sem: 4,
          probability: 0.07435999999999998,
          dropout_probability: 40,
          dropout_reason: "The dropout probability for Vivaan Patel is relatively moderate at 40%...",
          dropout_suggestions: "1. Seek additional help or tutoring in subjects where performance is below average...",
          semesters: [
            {
              semester_number: 1,
              subjects: [
                { name: "Mathematics-I", marks: 50, attendance: 90 },
                { name: "Physics", marks: 78, attendance: 80 },
                { name: "Chemistry", marks: 93, attendance: 78 },
                { name: "Basic Electronics", marks: 44, attendance: 60 },
                { name: "Computer Programming", marks: 66, attendance: 82 },
              ],
            },
            {
              semester_number: 2,
              subjects: [
                { name: "Mathematics-II", marks: 90, attendance: 84 },
                { name: "Data Structures", marks: 64, attendance: 86 },
                { name: "Digital Electronics", marks: 70, attendance: 69 },
                { name: "Object-Oriented Programming", marks: 39, attendance: 60 },
                { name: "Communication Skills", marks: 70, attendance: 95 },
              ],
            },
          ],
        },
        {
          _id: "681e52775aaf8ea9addeaa0d",
          name: "Aditya Reddy",
          usn: "1RV20CS003",
          gender: "Male",
          extracurricular: "10",
          current_sem: 2,
          probability: 0.04384400000000001,
          dropout_probability: 60,
          dropout_reason: "Aditya Reddy's dropout probability is relatively high due to a significant drop...",
          dropout_suggestions: "1. Aditya should focus on improving his academic performance...",
          semesters: [
            {
              semester_number: 1,
              subjects: [
                { name: "Mathematics-I", marks: 93, attendance: 94 },
                { name: "Physics", marks: 68, attendance: 95 },
                { name: "Chemistry", marks: 68, attendance: 64 },
                { name: "Basic Electronics", marks: 100, attendance: 63 },
                { name: "Computer Programming", marks: 58, attendance: 87 },
              ],
            },
            {
              semester_number: 2,
              subjects: [
                { name: "Mathematics-II", marks: 64, attendance: 63 },
                { name: "Data Structures", marks: 75, attendance: 92 },
                { name: "Digital Electronics", marks: 61, attendance: 92 },
                { name: "Object-Oriented Programming", marks: 45, attendance: 73 },
                { name: "Communication Skills", marks: 66, attendance: 90 },
              ],
            },
          ],
        },
      ]
      setStudents(sampleData)
    }
  }, [error])

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>
  }

  if (!students || students.length === 0) {
    return <div className="error">No student data available.</div>
  }

  // Calculate class-wide metrics
  const calculateClassMetrics = () => {
    // Get all unique subjects across all semesters
    const allSubjects = new Set()
    students.forEach((student) => {
      student.semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
          allSubjects.add(subject.name)
        })
      })
    })

    // Calculate average marks and attendance by semester
    const semesterMetrics = {}
    students.forEach((student) => {
      student.semesters.forEach((semester) => {
        const semNum = semester.semester_number

        if (!semesterMetrics[semNum]) {
          semesterMetrics[semNum] = {
            totalMarks: 0,
            totalAttendance: 0,
            count: 0,
            subjects: {},
          }
        }

        semester.subjects.forEach((subject) => {
          semesterMetrics[semNum].totalMarks += subject.marks
          semesterMetrics[semNum].totalAttendance += subject.attendance
          semesterMetrics[semNum].count += 1

          if (!semesterMetrics[semNum].subjects[subject.name]) {
            semesterMetrics[semNum].subjects[subject.name] = {
              totalMarks: 0,
              totalAttendance: 0,
              count: 0,
            }
          }

          semesterMetrics[semNum].subjects[subject.name].totalMarks += subject.marks
          semesterMetrics[semNum].subjects[subject.name].totalAttendance += subject.attendance
          semesterMetrics[semNum].subjects[subject.name].count += 1
        })
      })
    })

    // Calculate averages
    Object.keys(semesterMetrics).forEach((semNum) => {
      const metrics = semesterMetrics[semNum]
      metrics.avgMarks = Number((metrics.totalMarks / metrics.count).toFixed(2))
      metrics.avgAttendance = Number((metrics.totalAttendance / metrics.count).toFixed(2))

      Object.keys(metrics.subjects).forEach((subject) => {
        const subjectMetrics = metrics.subjects[subject]
        subjectMetrics.avgMarks = Number((subjectMetrics.totalMarks / subjectMetrics.count).toFixed(2))
        subjectMetrics.avgAttendance = Number((subjectMetrics.totalAttendance / subjectMetrics.count).toFixed(2))
      })
    })

    return { semesterMetrics, allSubjects: Array.from(allSubjects) }
  }

  const { semesterMetrics, allSubjects } = calculateClassMetrics()

  // Prepare data for charts
  const prepareSemesterAverageData = () => {
    return Object.keys(semesterMetrics).map((semNum) => ({
      name: `Semester ${semNum}`,
      avgMarks: semesterMetrics[semNum].avgMarks,
      avgAttendance: semesterMetrics[semNum].avgAttendance,
    }))
  }

  const prepareSubjectAverageData = () => {
    const data = []

    Object.keys(semesterMetrics).forEach((semNum) => {
      const subjects = semesterMetrics[semNum].subjects

      Object.keys(subjects).forEach((subject) => {
        data.push({
          name: subject,
          semester: `Sem ${semNum}`,
          avgMarks: subjects[subject].avgMarks,
          avgAttendance: subjects[subject].avgAttendance,
        })
      })
    })

    return data
  }

  const prepareDropoutRiskData = () => {
    // Count students in each risk category
    const riskCategories = {
      high: 0,
      medium: 0,
      low: 0,
    }

    students.forEach((student) => {
      if (student.dropout_probability >= 60) {
        riskCategories.high += 1
      } else if (student.dropout_probability >= 40) {
        riskCategories.medium += 1
      } else {
        riskCategories.low += 1
      }
    })

    // Calculate percentages
    const total = students.length
    return [
      {
        name: "High Risk (60%+)",
        value: riskCategories.high,
        percentage: ((riskCategories.high / total) * 100).toFixed(1),
        color: "#F44336",
      },
      {
        name: "Medium Risk (40-59%)",
        value: riskCategories.medium,
        percentage: ((riskCategories.medium / total) * 100).toFixed(1),
        color: "#FFC107",
      },
      {
        name: "Low Risk (<40%)",
        value: riskCategories.low,
        percentage: ((riskCategories.low / total) * 100).toFixed(1),
        color: "#4CAF50",
      },
    ]
  }

  const prepareGenderDistributionData = () => {
    const genderCount = {
      Male: 0,
      Female: 0,
      Other: 0,
    }

    students.forEach((student) => {
      if (student.gender in genderCount) {
        genderCount[student.gender] += 1
      } else {
        genderCount.Other += 1
      }
    })

    return [
      { name: "Male", value: genderCount.Male, color: "#2196F3" },
      { name: "Female", value: genderCount.Female, color: "#E91E63" },
      { name: "Other", value: genderCount.Other, color: "#9C27B0" },
    ]
  }

  const prepareSubjectPerformanceRadarData = (semesterNum) => {
    if (!semesterMetrics[semesterNum]) return []

    return Object.keys(semesterMetrics[semesterNum].subjects).map((subject) => ({
      subject: subject,
      marks: semesterMetrics[semesterNum].subjects[subject].avgMarks,
      attendance: semesterMetrics[semesterNum].subjects[subject].avgAttendance,
      fullMark: 100,
    }))
  }

  const prepareMarksAttendanceCorrelationData = () => {
    const data = []

    students.forEach((student) => {
      student.semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
          data.push({
            x: subject.attendance,
            y: subject.marks,
            z: 1,
            name: subject.name,
            semester: semester.semester_number,
            student: student.name,
          })
        })
      })
    })

    return data
  }

  const prepareExtracurricularVsPerformanceData = () => {
    // Group students by extracurricular level
    const extracurricularGroups = {}

    students.forEach((student) => {
      const level = student.extracurricular

      if (!extracurricularGroups[level]) {
        extracurricularGroups[level] = {
          totalMarks: 0,
          totalAttendance: 0,
          count: 0,
        }
      }

      student.semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
          extracurricularGroups[level].totalMarks += subject.marks
          extracurricularGroups[level].totalAttendance += subject.attendance
          extracurricularGroups[level].count += 1
        })
      })
    })

    // Calculate averages
    return Object.keys(extracurricularGroups)
      .map((level) => {
        const group = extracurricularGroups[level]
        return {
          level: `Level ${level}`,
          avgMarks: Number((group.totalMarks / group.count).toFixed(2)),
          avgAttendance: Number((group.totalAttendance / group.count).toFixed(2)),
          count: students.filter((s) => s.extracurricular === level).length,
        }
      })
      .sort((a, b) => a.level.localeCompare(b.level))
  }

  const semesterAverageData = prepareSemesterAverageData()
  const subjectAverageData = prepareSubjectAverageData()
  const dropoutRiskData = prepareDropoutRiskData()
  const genderDistributionData = prepareGenderDistributionData()
  const radarData1 = prepareSubjectPerformanceRadarData(1)
  const radarData2 = prepareSubjectPerformanceRadarData(2)
  const correlationData = prepareMarksAttendanceCorrelationData()
  const extracurricularData = prepareExtracurricularVsPerformanceData()

  // Animation properties
  const getAnimationProps = () => {
    if (!animationActive) return {}

    return {
      isAnimationActive: true,
      animationBegin: 0,
      animationDuration: 1500,
      animationEasing: "ease-in-out",
    }
  }

  // Custom colors for charts
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"]

  // Calculate class average dropout probability
  const avgDropoutProbability =
    students.reduce((sum, student) => sum + student.dropout_probability, 0) / students.length
  const riskColor = avgDropoutProbability >= 60 ? "#F44336" : avgDropoutProbability >= 40 ? "#FFC107" : "#4CAF50"

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Class Performance Dashboard</h1>
        <div className="dashboard-controls">
          <button
            className={`animation-toggle ${animationActive ? "active" : ""}`}
            onClick={() => setAnimationActive(!animationActive)}
          >
            {animationActive ? "Disable Animations" : "Enable Animations"}
          </button>
        </div>
      </header>

      <div className="class-info-card">
        <div className="class-basic-info">
          <h2>Class Overview</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Total Students:</span>
              <span className="info-value">{students.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender Distribution:</span>
              <span className="info-value">
                {genderDistributionData.map((item) => `${item.name}: ${item.value}`).join(", ")}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Average Marks:</span>
              <span className="info-value">
                {(
                  students.reduce((sum, student) => {
                    let totalMarks = 0,
                      count = 0
                    student.semesters.forEach((sem) => {
                      sem.subjects.forEach((subj) => {
                        totalMarks += subj.marks
                        count++
                      })
                    })
                    return sum + totalMarks / count
                  }, 0) / students.length
                ).toFixed(2)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Average Attendance:</span>
              <span className="info-value">
                {(
                  students.reduce((sum, student) => {
                    let totalAttendance = 0,
                      count = 0
                    student.semesters.forEach((sem) => {
                      sem.subjects.forEach((subj) => {
                        totalAttendance += subj.attendance
                        count++
                      })
                    })
                    return sum + totalAttendance / count
                  }, 0) / students.length
                ).toFixed(2)}
                %
              </span>
            </div>
          </div>
        </div>
        <div className="dropout-risk">
          <div className="risk-meter" style={{ "--risk-color": riskColor }}>
            <div className="risk-indicator" style={{ width: `${avgDropoutProbability}%` }}></div>
          </div>
          <div className="risk-label">
            <span>Class Average Dropout Risk: </span>
            <span className="risk-value" style={{ color: riskColor }}>
              {avgDropoutProbability.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Chart 1: Semester Average Performance */}
        <div className="chart-card">
          <h3>Semester Average Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={semesterAverageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="avgMarks"
                name="Average Marks"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                activeDot={{ r: 8 }}
                {...getAnimationProps()}
              />
              <Area
                type="monotone"
                dataKey="avgAttendance"
                name="Average Attendance %"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
                {...getAnimationProps()}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Dropout Risk Distribution */}
        <div className="chart-card">
          <h3>Dropout Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dropoutRiskData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                {...getAnimationProps()}
              >
                {dropoutRiskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} students`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Subject Performance Comparison */}
        <div className="chart-card wide">
          <h3>Subject Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectAverageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgMarks" name="Average Marks" fill="#8884d8" {...getAnimationProps()} />
              <Bar dataKey="avgAttendance" name="Average Attendance %" fill="#82ca9d" {...getAnimationProps()} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Semester 1 Subject Performance */}
        <div className="chart-card">
          <h3>Semester 1 Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData1}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Marks"
                dataKey="marks"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                {...getAnimationProps()}
              />
              <Radar
                name="Attendance"
                dataKey="attendance"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                {...getAnimationProps()}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 5: Semester 2 Subject Performance */}
        <div className="chart-card">
          <h3>Semester 2 Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData2}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Marks"
                dataKey="marks"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                {...getAnimationProps()}
              />
              <Radar
                name="Attendance"
                dataKey="attendance"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                {...getAnimationProps()}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 6: Extracurricular vs Performance */}
        <div className="chart-card wide">
          <h3>Extracurricular Activity Level vs Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={extracurricularData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgMarks" name="Average Marks" fill="#8884d8" {...getAnimationProps()} />
              <Bar dataKey="avgAttendance" name="Average Attendance %" fill="#82ca9d" {...getAnimationProps()} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 7: Marks vs Attendance Correlation */}
        <div className="chart-card wide">
          <h3>Marks vs Attendance Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Attendance %" domain={[40, 100]} />
              <YAxis type="number" dataKey="y" name="Marks" domain={[0, 100]} />
              <ZAxis type="number" dataKey="z" range={[100, 100]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="custom-tooltip">
                        <p>{`${payload[0].payload.name} (Sem ${payload[0].payload.semester})`}</p>
                        <p>{`Student: ${payload[0].payload.student}`}</p>
                        <p>{`Attendance: ${payload[0].payload.x}%`}</p>
                        <p>{`Marks: ${payload[0].payload.y}`}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Scatter name="Students" data={correlationData} fill="#8884d8" {...getAnimationProps()} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analysis-section">
        <div className="analysis-card">
          <h3>Class Dropout Risk Analysis</h3>
          <p>
            Based on the analysis of {students.length} students, the class has an average dropout risk of{" "}
            {avgDropoutProbability.toFixed(1)}%.
            {dropoutRiskData[0].value > 0 &&
              ` ${dropoutRiskData[0].percentage}% of students are at high risk of dropping out (60% or higher probability).`}
            {dropoutRiskData[1].value > 0 &&
              ` ${dropoutRiskData[1].percentage}% of students are at medium risk (40-59% probability).`}
            {dropoutRiskData[2].value > 0 &&
              ` ${dropoutRiskData[2].percentage}% of students are at low risk (below 40% probability).`}
          </p>
          <p className="mt-3">
            The data shows that{" "}
            {semesterAverageData.length > 1 && semesterAverageData[1].avgMarks > semesterAverageData[0].avgMarks
              ? "there is an improvement in average marks from Semester 1 to Semester 2."
              : "there is a decline in average marks from Semester 1 to Semester 2."}{" "}
            Similarly,{" "}
            {semesterAverageData.length > 1 &&
            semesterAverageData[1].avgAttendance > semesterAverageData[0].avgAttendance
              ? "attendance has improved in Semester 2 compared to Semester 1."
              : "attendance has declined in Semester 2 compared to Semester 1."}
          </p>
        </div>
        <div className="analysis-card">
          <h3>Improvement Suggestions</h3>
          <div className="suggestions-list">
            <div className="suggestion-item">
              Focus on improving performance in subjects with the lowest average marks:{" "}
              {Object.entries(semesterMetrics)
                .flatMap(([semNum, data]) =>
                  Object.entries(data.subjects).map(([subject, metrics]) => ({
                    subject,
                    avgMarks: metrics.avgMarks,
                    semester: semNum,
                  })),
                )
                .sort((a, b) => a.avgMarks - b.avgMarks)
                .slice(0, 3)
                .map((item) => `${item.subject} (Sem ${item.semester}: ${item.avgMarks}%)`)
                .join(", ")}
            </div>
            <div className="suggestion-item">
              Improve attendance in subjects with the lowest attendance rates:{" "}
              {Object.entries(semesterMetrics)
                .flatMap(([semNum, data]) =>
                  Object.entries(data.subjects).map(([subject, metrics]) => ({
                    subject,
                    avgAttendance: metrics.avgAttendance,
                    semester: semNum,
                  })),
                )
                .sort((a, b) => a.avgAttendance - b.avgAttendance)
                .slice(0, 3)
                .map((item) => `${item.subject} (Sem ${item.semester}: ${item.avgAttendance}%)`)
                .join(", ")}
            </div>
            <div className="suggestion-item">
              Provide additional support for high-risk students through tutoring programs and academic counseling.
            </div>
            <div className="suggestion-item">
              Implement early intervention strategies for students showing declining performance between semesters.
            </div>
            <div className="suggestion-item">
              Encourage participation in extracurricular activities at an optimal level to balance academic performance.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralDashboard
