import React, { useEffect, useContext } from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const LandingPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  return (
    <div className="window">
      <div className="content">
        {/* Inline SVG Logo */}
        <div className="logo">
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="100" rx="20" fill="#2B6CB0" />
            <path
              d="M50 15L85 35L50 55L15 35L50 15Z"
              fill="white"
            />
            <path
              d="M35 50V70L50 80L65 70V50"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1>🎓 EduGuard</h1>
        <p>Predict and prevent student dropouts with data insights.</p>

        <div className="buttons">
          <button
            onClick={() => {
              navigate("/signin");
            }}>
            Sign In
          </button>
          <button
            className="secondary"
            onClick={() => {
              navigate("/signup");
            }}>
            Sign Up
          </button>
        </div>

        <div className="footer">
          <span>▪ Secure & Private</span>
          <span>▪ Free for Institutions</span>
        </div>

        <div className="version">v1.0 | Hackathon Edition</div>
      </div>
    </div>
  );
};

export default LandingPage;
