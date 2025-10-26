import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../App.css';
import '../styles/common.css';
import './SignUp.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const SignUp = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    collegeName: '',
    password: '',
    confirmPassword: ''
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if avatar is uploaded
    if (!avatar) {
      setError('Please upload a profile picture');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('fullName', formData.fullName);
      data.append('collegeName', formData.collegeName);
      data.append('password', formData.password);
      data.append('avatar', avatar);

      const response = await axios.post(
        'http://localhost:4500/api/v1/faculty/register',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log(response.data);
      navigate('/SignIn');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!formData.username || !formData.email || !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!nameRegex.test(formData.fullName)) {
      setError('Name must contain only letters and spaces');
      return;
    }

    setError('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Faculty Account</h1>
          <p>Sign up to access the student dropout risk predictor</p>
        </div>

        <div className="signup-body">
          <div className="form-steps">
            <div className="step-indicator">
              <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-label">Basic Info</div>
            </div>
            <div className="step-connector" />
            <div className="step-indicator">
              <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className="step-label">Details</div>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
            {step === 1 ? (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">Username*</label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Choose a unique username"
                    disabled={isLoading}
                  />
                  <div className="form-hint">Username must be unique and will be used for login</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address*</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Your full name"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    Continue
                  </button>
                </div>

                <div className="signin-link">
                  Already have an account? <Link to="/signin">Sign In</Link>
                </div>
              </div>
            ) : (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">College Name*</label>
                  <input
                    type="text"
                    name="collegeName"
                    required
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Your institution name"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Picture*</label>
                  <div className="avatar-upload">
                    <div className="avatar-preview">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Profile Preview" />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                    <div className="avatar-actions">
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('avatar').click()}
                        className="btn btn-secondary"
                        disabled={isLoading}
                      >
                        {avatarPreview ? 'Change Picture' : 'Upload Picture'}
                      </button>
                    </div>
                  </div>
                  <div className="form-hint">
                    Upload a professional profile picture
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password*</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <div className="form-hint">
                    Password must be at least 8 characters long
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password*</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn btn-secondary"
                    disabled={isLoading}
                    style={{ flex: '1' }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ flex: '2' }}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
