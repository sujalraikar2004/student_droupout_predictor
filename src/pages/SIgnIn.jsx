import React, { useState } from 'react';
import '../App.css'; // Ensure your styles are loaded
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(''); // Email input
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Send login request with email and password
      console.log('Email:', email);
      console.log('Password:', password);

      const response = await axios.post('http://localhost:4500/api/v1/faculty/login', {
        email, 
        password
      });

      console.log('Login response:', response.data);

      // Assuming the response contains an accessToken, save it to localStorage
      localStorage.setItem('token', response.data.accessToken); // Store the access token

      // Navigate to the home page after successful login
      navigate('/home');
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="window">
      <div className="content">
        <h1>Welcome Back</h1>
        <p>Please sign in to continue</p>

        {error && (
          <div
            style={{
              color: '#e53e3e',
              background: '#fed7d7',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px',
              maxWidth: '400px',
              margin: '0 auto 20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <div className="buttons" style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid var(--border)',
  outline: 'none',
  boxSizing: 'border-box',
};

export default SignIn;
