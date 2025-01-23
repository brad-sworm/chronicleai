import React, { useState } from 'react';
import axios from 'axios';

const SignInPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/signin', { email, password });
      if (response.data.success) {
        const { user, token } = response.data; // Get the user and token from the response
        setUser({ ...user, token }); // Set the user and token in state
        console.log('Sign in successful!');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in. Please try again.');
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default SignInPage;
