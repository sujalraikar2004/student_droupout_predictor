import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios
import './DataImport.css';
import '../styles/common.css';
import API_BASE_URL from '../config/api.js';

const DataImport = () => {
  const [formData, setFormData] = useState({
    usn: '',
    name: '',
    semester: '',
    subjects: []
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const subjectsBySemester = {
    '1': ['Mathematics-I', 'Physics', 'Chemistry', 'Basic Electronics', 'Computer Programming'],
    '2': ['Mathematics-II', 'Data Structures', 'Digital Electronics', 'Object-Oriented Programming', 'Communication Skills'],
    '3': ['Discrete Mathematics', 'Database Systems', 'Computer Organization', 'Operating Systems', 'Web Technologies'],
    '4': ['Algorithms', 'Computer Networks', 'Software Engineering', 'Artificial Intelligence', 'Theory of Computation'],
    '5': ['Machine Learning', 'Computer Graphics', 'Compiler Design', 'Information Security', 'Cloud Computing'],
    '6': ['Big Data Analytics', 'Mobile Computing', 'Internet of Things', 'Natural Language Processing', 'Blockchain Technology'],
    '7': ['Data Mining', 'Distributed Systems', 'Cryptography', 'Virtual Reality', 'Project Management'],
    '8': ['Final Year Project', 'Professional Ethics', 'Technical Communication', 'Entrepreneurship', 'Elective']
  };

  useEffect(() => {
    if (formData.semester) {
      const subjects = subjectsBySemester[formData.semester] || [];
      setSelectedSubjects(subjects.map(subject => ({
        name: subject,
        marks: '',
        attendance: ''
      })));
    } else {
      setSelectedSubjects([]);
    }
  }, [formData.semester]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...selectedSubjects];
    updatedSubjects[index][field] = value;
    setSelectedSubjects(updatedSubjects);
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvData = event.target.result;
          const rows = csvData.split('\n').filter(Boolean);
          const headers = rows[0].split(',');

          if (headers.length < 3) {
            setError('Invalid CSV format. Please include USN, Name, and Semester.');
            setFileData(null);
            return;
          }

          const parsedData = rows.slice(1).map(row => {
            const values = row.split(',');
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header.trim()] = values[index]?.trim() || '';
            });
            return rowData;
          });

          setFileData(parsedData);
          setError('');
        } catch (err) {
          setError('Error parsing CSV file. Please check the format.');
          setFileData(null);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setFileData(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataToSubmit = file ? {
        type: 'csv',
        data: fileData
      } : {
        type: 'manual',
        data: {
          ...formData,
          subjects: selectedSubjects
        }
      };

      // Sending data to the backend using Axios
      const formDataToSend = new FormData();
      if (file) {
        formDataToSend.append('file', file);
      }

      // If no file, manually add data to formData
      if (!file) {
        formDataToSend.append('data', JSON.stringify(dataToSubmit.data));
      }

      // Send POST request to backend
      const response = await axios.post(`${API_BASE_URL}/api/vi/student/register`, formDataToSend, {
        headers: {
          'Content-Type': file ? 'multipart/form-data' : 'application/json'
        }
      });

      setSuccess('Data submitted successfully! The prediction model is analyzing the data.');

      if (!file) {
        setFormData({ usn: '', name: '', semester: '', subjects: [] });
        setSelectedSubjects([]);
      }
    } catch (err) {
      setError('Error submitting data. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-import-container">
      <div className="data-import-header">
        <h1>Student Dropout Risk Predictor</h1>
        <p>Input academic and attendance data to predict dropout risk</p>
      </div>

      <div className="import-options">
        <button
          className={`import-option-button ${!file ? 'active' : 'inactive'}`}
          onClick={() => setFile(null)}
        >
          Manual Entry
        </button>
        <button
          className={`import-option-button ${file ? 'active' : 'inactive'}`}
          onClick={() => document.getElementById('csvFileInput').click()}
        >
          Upload CSV
        </button>
        <input
          id="csvFileInput"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>

      {error && <div className="alert-message error">{error}</div>}
      {success && <div className="alert-message success">{success}</div>}

      {!file ? (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row">
            <div className="form-group">
              <label>USN</label>
              <input
                type="text"
                name="usn"
                required
                value={formData.usn}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., 1XX21CS001"
              />
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Full Name"
              />
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select
                name="semester"
                required
                value={formData.semester}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedSubjects.length > 0 && (
            <div className="subject-table">
              <h3>Subject Data</h3>
              <div className="subject-table-header">
                <div>Subject</div>
                <div>Marks (%)</div>
                <div>Attendance (%)</div>
              </div>
              {selectedSubjects.map((subject, index) => (
                <div key={index} className="subject-row">
                  <div>{subject.name}</div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={subject.marks}
                    onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={subject.attendance}
                    onChange={(e) => handleSubjectChange(index, 'attendance', e.target.value)}
                    className="form-control"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="submit-container">
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? 'Processing...' : 'Submit Data'}
            </button>
          </div>
        </form>
      ) : (
        <div className="form-container file-preview-container">
          <div className="file-upload-section">
            <p>Selected file: <strong>{file.name}</strong></p>
            <div className="file-actions">
              <button className="file-button primary" onClick={() => document.getElementById('csvFileInput').click()}>
                Change File
              </button>
              <button className="file-button secondary" onClick={() => setFile(null)}>
                Cancel
              </button>
            </div>
          </div>

          {fileData && (
            <div className="data-preview-section">
              <h3>Data Preview</h3>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(fileData[0] || {}).map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {fileData.length > 5 && (
                  <div className="data-table-footer">
                    Showing 5 of {fileData.length} rows
                  </div>
                )}
              </div>

              <div className="submit-container">
                <button onClick={handleSubmit} disabled={isLoading} className="submit-button">
                  {isLoading ? 'Processing...' : 'Submit Data'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataImport;
