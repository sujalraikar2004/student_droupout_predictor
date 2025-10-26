import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import DataImport from '../components/DataImport';
import StudentRecords from '../components/StudentRecords';
import StudentDetails from '../components/StudentDetails'; // NEW
import  GeneralDashboard from '../components/GeneralDashboard';
import Profile from '../components/Profile';
import './Home.css';
import '../styles/common.css';

const Home = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const [activeOption, setActiveOption] = useState('dataImport');
  const [selectedStudentId, setSelectedStudentId] = useState(null); // NEW

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  // Conditionally render content
  const renderContent = () => {
    if (activeOption === 'dataImport') return <DataImport />;
    if (activeOption === 'generalDashboard') return <GeneralDashboard />;
    if (activeOption === 'profile') return <Profile />;
    if (selectedStudentId) {
      return (
        <StudentDetails
          studentId={selectedStudentId}
          onBack={() => setSelectedStudentId(null)} // Allow going back to list
        />
      );
    }
    return <StudentRecords onStudentClick={(id) => setSelectedStudentId(id)} />;
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="app-logo">E</div>
          <span className="app-name">EduGuard</span>
        </div>

        <div className="sidebar-menu">
          <div
            className={`menu-item ${activeOption === 'dataImport' ? 'active' : ''}`}
            onClick={() => {
              setActiveOption('dataImport');
              setSelectedStudentId(null); // Reset on menu switch
            }}
          >
            <span className="menu-icon">📊</span>
            <span className="menu-text">Data Import</span>
          </div>

          <div
            className={`menu-item ${activeOption === 'studentRecords' ? 'active' : ''}`}
            onClick={() => {
              setActiveOption('studentRecords');
              setSelectedStudentId(null);
            }}
          >
            <span className="menu-icon">👨‍🎓</span>
            <span className="menu-text">Student Records</span>
          </div>
          <div>
            <div
              className={`menu-item ${activeOption === 'generalDashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveOption('generalDashboard');
                
              }}
            >
              <span className="menu-icon">📈</span>
              <span className="menu-text">General Dashboard</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div  onClick={handleSignOut}><span className="menu-icon">🚪</span>
          <span className="menu-text">Sign Out</span></div>
          <div  className={`menu-item ${activeOption === 'profile' ? 'active' : ''}`} onClick={()=>{
            setActiveOption('profile');
          }}>
             <span>profile</span>

          </div>
          
        </div>
      </div>

      <div className="main-content">
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Home;
