"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  ReferenceLine,
} from "recharts"
import "./StudentProfile.css"

const StudentProfile = ({ studentData }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [animatedValue, setAnimatedValue] = useState(0)
  const [selectedSemester, setSelectedSemester] = useState(0)

  // Animation effect for risk probability
  useEffect(() => {
    // Use dropout_probability if available, otherwise use probability
    const probability = studentData?.dropout_probability
      ? studentData.dropout_probability / 100
      : studentData?.probability || 0

    const duration = 1500 // Animation duration in ms
    const steps = 60 // Number of steps in animation
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const newValue = probability * (currentStep / steps)
      setAnimatedValue(newValue)

      // Update CSS variable for animations
      document.documentElement.style.setProperty("--animated-value", newValue)

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [studentData])

  // Calculate overall attendance and marks
  const calculateOverallStats = () => {
    if (!studentData || !studentData.semesters) return { avgAttendance: 0, avgMarks: 0, cgpa: 0 }

    let totalAttendance = 0
    let totalMarks = 0
    let subjectCount = 0
    let totalGradePoints = 0

    studentData.semesters.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        totalAttendance += subject.attendance
        totalMarks += subject.marks

        // Calculate grade points for CGPA (10-point scale)
        let gradePoint = 0
        if (subject.marks >= 90) gradePoint = 10
        else if (subject.marks >= 80) gradePoint = 9
        else if (subject.marks >= 70) gradePoint = 8
        else if (subject.marks >= 60) gradePoint = 7
        else if (subject.marks >= 50) gradePoint = 6
        else if (subject.marks >= 40) gradePoint = 5
        else gradePoint = 4

        totalGradePoints += gradePoint
        subjectCount++
      })
    })

    return {
      avgAttendance: subjectCount ? (totalAttendance / subjectCount).toFixed(2) : 0,
      avgMarks: subjectCount ? (totalMarks / subjectCount).toFixed(2) : 0,
      cgpa: subjectCount ? (totalGradePoints / subjectCount).toFixed(2) : 0,
    }
  }

  // Prepare data for semester-wise performance chart
  const prepareSemesterPerformanceData = () => {
    if (!studentData || !studentData.semesters) return []

    return studentData.semesters.map((sem) => {
      const subjects = sem.subjects || []
      const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0)
      const totalAttendance = subjects.reduce((sum, subject) => sum + subject.attendance, 0)

      return {
        name: `Semester ${sem.semester_number}`,
        avgMarks: subjects.length ? Number.parseFloat((totalMarks / subjects.length).toFixed(2)) : 0,
        avgAttendance: subjects.length ? Number.parseFloat((totalAttendance / subjects.length).toFixed(2)) : 0,
      }
    })
  }

  // Prepare data for radar chart
  const prepareRadarData = (semesterIndex) => {
    if (!studentData || !studentData.semesters || !studentData.semesters[semesterIndex]) return []

    return studentData.semesters[semesterIndex].subjects.map((subject) => ({
      subject: subject.name,
      marks: subject.marks,
      attendance: subject.attendance,
      fullMark: 100,
    }))
  }

  // Prepare data for risk factors pie chart
  const prepareRiskFactorsData = () => {
    if (!studentData || !studentData.semesters) return []

    // Calculate risk factors
    const lowAttendanceSubjects =
      studentData.semesters.reduce((count, sem) => {
        return count + (sem.subjects?.filter((subj) => subj.attendance < 75)?.length || 0)
      }, 0) || 1 // Ensure at least 1 to avoid empty chart

    const lowMarksSubjects =
      studentData.semesters.reduce((count, sem) => {
        return count + (sem.subjects?.filter((subj) => subj.marks < 60)?.length || 0)
      }, 0) || 1

    const extracurricular = Number.parseInt(studentData.extracurricular || 0)
    const extracurricularGap = Math.max(1, 5 - extracurricular)

    return [
      { name: "Low Attendance Subjects", value: lowAttendanceSubjects, color: "#FF6B6B" },
      { name: "Low Marks Subjects", value: lowMarksSubjects, color: "#4D96FF" },
      { name: "Extracurricular Gap", value: extracurricularGap, color: "#6BCB77" },
    ]
  }

  // Calculate overall stats
  const { avgAttendance, avgMarks, cgpa } = calculateOverallStats()

  // Risk level determination
  const getRiskLevel = (probability) => {
    // Using the dropout_probability field (0-100 scale) if available
    const dropoutProb =
      studentData?.dropout_probability !== undefined ? studentData.dropout_probability / 100 : probability

    if (dropoutProb < 0.3) return { level: "Low", color: "#4CAF50" }
    if (dropoutProb < 0.7) return { level: "Medium", color: "#FF9800" }
    return { level: "High", color: "#F44336" }
  }

  const riskInfo = getRiskLevel(studentData?.probability || 0)

  // Prepare data for charts
  const semesterPerformanceData = prepareSemesterPerformanceData()
  const radarData = prepareRadarData(selectedSemester)
  const riskFactorsData = prepareRiskFactorsData()

  // Vibrant color palette
  const COLORS = {
    primary: "#4D96FF",
    secondary: "#6BCB77",
    accent: "#FF6B6B",
    warning: "#FFD93D",
    info: "#4CC9F0",
    purple: "#9B5DE5",
    pink: "#F15BB5",
    teal: "#00F5D4",
    orange: "#FF9F1C",
  }

  if (!studentData) {
    return <div className="loading">Loading student data...</div>
  }

  return (
    <div className="student-profile">
      <div className="profile-header">
        <div className="student-avatar">
          <div className="avatar-circle">{studentData.name ? studentData.name.charAt(0).toUpperCase() : "S"}</div>
        </div>
        <div className="student-info">
          <h1>{studentData.name}</h1>
          <div className="student-details">
            <div className="detail-item">
              <span className="detail-label">USN:</span>
              <span className="detail-value">{studentData.usn}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{studentData.gender}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Semester:</span>
              <span className="detail-value">{studentData.current_sem}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Extracurricular:</span>
              <span className="detail-value">{studentData.extracurricular} activities</span>
            </div>
          </div>
        </div>
        <div className="risk-indicator">
          <div className="risk-meter-container">
            <div className="risk-meter">
              <div
                className="risk-fill"
                style={{
                  width: `${animatedValue * 100}%`,
                  backgroundColor: riskInfo.color,
                }}
              ></div>
            </div>
            <div className="risk-percentage-display">
              <div className="risk-percentage-circle" style={{ borderColor: riskInfo.color }}>
                <div className="risk-percentage-value" style={{ color: riskInfo.color }}>
                  {studentData.dropout_probability || (animatedValue * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
          <div className="risk-label">
            <span>Dropout Risk:</span>
            <span style={{ color: riskInfo.color, fontWeight: "bold" }}>{riskInfo.level}</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance
        </button>
        <button
          className={`tab-button ${activeTab === "performance" ? "active" : ""}`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
        <button className={`tab-button ${activeTab === "risk" ? "active" : ""}`} onClick={() => setActiveTab("risk")}>
          Risk Analysis
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon attendance-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-value">{avgAttendance}%</div>
                  <div className="stat-label">Average Attendance</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon marks-icon">📝</div>
                <div className="stat-info">
                  <div className="stat-value">{avgMarks}</div>
                  <div className="stat-label">Average Marks</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon cgpa-icon">🏆</div>
                <div className="stat-info">
                  <div className="stat-value">{cgpa}</div>
                  <div className="stat-label">CGPA</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon semester-icon">🎓</div>
                <div className="stat-info">
                  <div className="stat-value">{studentData.current_sem}</div>
                  <div className="stat-label">Current Semester</div>
                </div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-card">
                <h3>Semester-wise Performance</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={semesterPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis domain={[0, 100]} stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "8px",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="avgMarks"
                        name="Average Marks"
                        stroke={COLORS.primary}
                        fillOpacity={1}
                        fill="url(#colorMarks)"
                        activeDot={{ r: 8, stroke: COLORS.primary, strokeWidth: 2, fill: "white" }}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="chart-card">
                <h3>Subject Performance (Current Semester)</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e0e0e0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#666" }} />
                      <Radar
                        name="Marks"
                        dataKey="marks"
                        stroke={COLORS.accent}
                        fill={COLORS.accent}
                        fillOpacity={0.6}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "8px",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="attendance-tab">
            <div className="chart-card">
              <h3>Semester-wise Attendance</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={semesterPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis domain={[0, 100]} stroke="#666" />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Attendance"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="avgAttendance"
                      name="Average Attendance"
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    >
                      {semesterPerformanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.avgAttendance < 75 ? COLORS.warning : COLORS.secondary}
                        />
                      ))}
                    </Bar>
                    <ReferenceLine
                      y={75}
                      stroke={COLORS.warning}
                      strokeDasharray="3 3"
                      label={{
                        value: "Min. Required (75%)",
                        position: "insideTopLeft",
                        fill: COLORS.warning,
                        fontSize: 12,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="attendance-details">
              <h3>Attendance Breakdown</h3>
              <div className="semester-selector">
                {studentData.semesters.map((semester, index) => (
                  <button
                    key={index}
                    className={`semester-button ${index === selectedSemester ? "active" : ""}`}
                    onClick={() => setSelectedSemester(index)}
                  >
                    Semester {semester.semester_number}
                  </button>
                ))}
              </div>

              <div className="chart-card">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={studentData.semesters[selectedSemester].subjects}
                    margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      stroke="#666"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 100]} stroke="#666" />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Attendance"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Bar
                      dataKey="attendance"
                      name="Subject Attendance"
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    >
                      {studentData.semesters[selectedSemester].subjects.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.attendance < 75 ? COLORS.warning : COLORS.info} />
                      ))}
                    </Bar>
                    <ReferenceLine y={75} stroke={COLORS.warning} strokeDasharray="3 3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="subject-attendance-table">
                <div className="table-header">
                  <div className="table-cell">Subject</div>
                  <div className="table-cell">Attendance</div>
                  <div className="table-cell">Status</div>
                </div>
                {studentData.semesters[selectedSemester].subjects.map((subject, index) => (
                  <div className="table-row" key={index}>
                    <div className="table-cell subject-name">{subject.name}</div>
                    <div className="table-cell">{subject.attendance}%</div>
                    <div className="table-cell">
                      <span className={`status-badge ${subject.attendance < 75 ? "warning" : "success"}`}>
                        {subject.attendance < 75 ? "Low" : "Good"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="performance-tab">
            <div className="chart-card">
              <h3>Semester-wise Academic Performance</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={semesterPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis domain={[0, 100]} stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="avgMarks"
                      name="Average Marks"
                      fill={COLORS.secondary}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <ReferenceLine
                      y={40}
                      stroke="#F44336"
                      strokeDasharray="3 3"
                      label={{
                        value: "Passing Mark (40)",
                        position: "insideTopLeft",
                        fill: "#F44336",
                        fontSize: 12,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="performance-details">
              <h3>Subject-wise Performance</h3>
              <div className="semester-selector">
                {studentData.semesters.map((semester, index) => (
                  <button
                    key={index}
                    className={`semester-button ${index === selectedSemester ? "active" : ""}`}
                    onClick={() => setSelectedSemester(index)}
                  >
                    Semester {semester.semester_number}
                  </button>
                ))}
              </div>

              <div className="chart-card">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={studentData.semesters[selectedSemester].subjects}
                    margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      stroke="#666"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 100]} stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Bar dataKey="marks" name="Subject Marks" animationDuration={1500} animationEasing="ease-in-out">
                      {studentData.semesters[selectedSemester].subjects.map((entry, index) => {
                        let color = COLORS.accent
                        if (entry.marks >= 80) color = COLORS.secondary
                        else if (entry.marks >= 60) color = COLORS.primary
                        else if (entry.marks >= 40) color = COLORS.warning
                        return <Cell key={`cell-${index}`} fill={color} />
                      })}
                    </Bar>
                    <ReferenceLine y={40} stroke="#F44336" strokeDasharray="3 3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="subject-performance-table">
                <div className="table-header">
                  <div className="table-cell">Subject</div>
                  <div className="table-cell">Marks</div>
                  <div className="table-cell">Grade</div>
                </div>
                {studentData.semesters[selectedSemester].subjects.map((subject, index) => {
                  // Simple grade calculation
                  let grade = "F"
                  if (subject.marks >= 90) grade = "A+"
                  else if (subject.marks >= 80) grade = "A"
                  else if (subject.marks >= 70) grade = "B"
                  else if (subject.marks >= 60) grade = "C"
                  else if (subject.marks >= 50) grade = "D"
                  else if (subject.marks >= 40) grade = "E"

                  return (
                    <div className="table-row" key={index}>
                      <div className="table-cell subject-name">{subject.name}</div>
                      <div className="table-cell">{subject.marks}/100</div>
                      <div className="table-cell">
                        <span className={`grade-badge grade-${grade.charAt(0).toLowerCase()}`}>{grade}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "risk" && (
          <div className="risk-tab">
            <div className="risk-summary">
              <div className="risk-gauge-container">
                <ResponsiveContainer width={200} height={200}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="100%"
                    barSize={10}
                    data={[
                      {
                        name: "Dropout Risk",
                        value: studentData.dropout_probability || animatedValue * 100,
                        fill: riskInfo.color,
                      },
                    ]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background={{ fill: "#f5f5f5" }}
                      dataKey="value"
                      cornerRadius={10}
                      label={{
                        position: "center",
                        fill: riskInfo.color,
                        fontSize: 24,
                        fontWeight: "bold",
                        formatter: (value) => `${value.toFixed(0)}%`,
                      }}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <Legend iconSize={0} verticalAlign="bottom" height={20} formatter={() => `Dropout Risk`} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="risk-level-text" style={{ color: riskInfo.color }}>
                  {riskInfo.level} Risk of Dropout
                </div>
              </div>

              <div className="risk-explanation">
                <h3>Risk Assessment</h3>
                {studentData.dropout_reason ? (
                  <div className="dropout-reason">
                    <p>{studentData.dropout_reason}</p>
                  </div>
                ) : (
                  <p>
                    Based on the student's academic performance, attendance records, and other factors, our predictive
                    model has determined that this student has a
                    <strong style={{ color: riskInfo.color }}> {riskInfo.level.toLowerCase()} risk </strong>
                    of dropping out.
                  </p>
                )}

                <div className="risk-factors">
                  <h4>Key Risk Factors:</h4>
                  <div className="risk-factors-grid">
                    {studentData.semesters.some((sem) => sem.subjects.some((subj) => subj.attendance < 75)) && (
                      <div className="risk-factor-card">
                        <div className="risk-factor-icon">📉</div>
                        <div className="risk-factor-text">Low attendance in one or more subjects</div>
                      </div>
                    )}

                    {studentData.semesters.some((sem) => sem.subjects.some((subj) => subj.marks < 60)) && (
                      <div className="risk-factor-card">
                        <div className="risk-factor-icon">📝</div>
                        <div className="risk-factor-text">Poor performance in one or more subjects</div>
                      </div>
                    )}

                    {Number.parseInt(studentData.extracurricular) < 2 && (
                      <div className="risk-factor-card">
                        <div className="risk-factor-icon">🎭</div>
                        <div className="risk-factor-text">Limited extracurricular involvement</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-card">
                <h3>Risk Factors Analysis</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskFactorsData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      >
                        {riskFactorsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [value, name]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "8px",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card intervention-card">
                <h3>Recommended Interventions</h3>
                {studentData.dropout_suggestions ? (
                  <div className="dropout-suggestions">
                    {studentData.dropout_suggestions.split("\n").map((suggestion, index) => (
                      <div key={index} className="suggestion-item">
                        <div className="suggestion-number">{index + 1}</div>
                        <div className="suggestion-text">{suggestion.replace(/^\d+\.\s*/, "")}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="interventions-list">
                    {studentData.semesters.some((sem) => sem.subjects.some((subj) => subj.attendance < 75)) && (
                      <div className="intervention-item">
                        <div className="intervention-icon">📅</div>
                        <div className="intervention-content">
                          <h4>Attendance Improvement Plan</h4>
                          <p>
                            Schedule regular check-ins to monitor attendance and address any issues preventing regular
                            class attendance.
                          </p>
                        </div>
                      </div>
                    )}

                    {studentData.semesters.some((sem) => sem.subjects.some((subj) => subj.marks < 60)) && (
                      <div className="intervention-item">
                        <div className="intervention-icon">📚</div>
                        <div className="intervention-content">
                          <h4>Academic Support</h4>
                          <p>Provide additional tutoring or study resources for subjects with low performance.</p>
                        </div>
                      </div>
                    )}

                    {Number.parseInt(studentData.extracurricular) < 2 && (
                      <div className="intervention-item">
                        <div className="intervention-icon">🏆</div>
                        <div className="intervention-content">
                          <h4>Extracurricular Engagement</h4>
                          <p>
                            Encourage participation in campus activities to increase engagement and sense of belonging.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="intervention-item">
                      <div className="intervention-icon">👥</div>
                      <div className="intervention-content">
                        <h4>Mentorship Program</h4>
                        <p>
                          Connect the student with a faculty mentor or peer mentor for regular guidance and support.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentProfile
