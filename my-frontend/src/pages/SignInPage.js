import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SignInPage.css'; // Import the CSS file for styling

const SignInPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/signin', { email, password });
      if (response.data.success) {
        const { user, token } = response.data; // Get the full user and token from the response
        setUser({ ...user, token }); // Set the full user object (including id and token)
        console.log('Sign in successful!', user); // Debugging: log the full user object
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <h1 className="signin-title">Sign In</h1>
      <div className="card-container">
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="signin-btn">Sign In</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default SignInPage;
