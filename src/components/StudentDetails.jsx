import React, { useEffect, useState } from 'react';
import StudentProfile from './StudentProfile';
import './StudentDetails.css';
import axios from 'axios';

const StudentDetails = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    if (!studentId) return;

    const fetchStudent = async () => {
      try {
        // In a real app, this would be an API call to your backend
        // For this demo, we'll use the sample data provided

        // Simulate API delay
     

        const responce = await axios.get(`http://localhost:4500/api/vi/student/${studentId}`);
       
        setStudent(responce.data);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch student details:', error);
        setError('Failed to load student data. Please try again later.');
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="student-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-details-error">
        <div className="error-icon">❌</div>
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!student) return <div className="error-message">Student not found</div>;

  return (
    <div className="student-details-container">
      {onBack && (
        <button className="back-button" onClick={onBack}>← Back to Student List</button>
      )}
      <StudentProfile studentData={student} />
    </div>
  );
};

export default StudentDetails;
