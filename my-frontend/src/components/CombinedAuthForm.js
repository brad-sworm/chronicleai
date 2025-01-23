import React, { useState } from 'react';
import { useUser } from '../UserContext';
import '../styles/CombinedAuthForm.css'; // Make sure you import the CSS file

const authenticateUser = async (email, password) => {
  const response = await fetch('http://localhost:3001/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('User data:', data); // Log the data to debug
    return { username: data.user.username, email: data.user.email, token: data.token };
  } else {
    throw new Error('Authentication failed');
  }
};

const CombinedAuthForm = () => {
  const { user, setUser } = useUser(); // Get the user and setUser from the context
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const response = await fetch('http://localhost:3001/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Sign up data:', data); // Log the data to debug
          setUser({ username: data.username, email: data.email });
          setMessage(`${data.username} is now signed up!`);
        } else {
          throw new Error('Sign-up failed');
        }
      } else {
        const userData = await authenticateUser(formData.email, formData.password);
        console.log('Sign in data:', userData); // Log the data to debug
        setUser({ username: userData.username, email: userData.email });
        setMessage(`${userData.username} is now signed in!`);
        localStorage.setItem('token', userData.token);
      }
    } catch (error) {
      console.error(error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </label>
            <br />
          </>
        )}
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </label>
        <br />
        <button type="submit" className="auth-button">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="switch-button">
        Switch to {isSignUp ? 'Sign In' : 'Sign Up'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CombinedAuthForm;
