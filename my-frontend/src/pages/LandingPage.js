import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-page-container">
        <h1>Welcome to ChronicleAI!</h1>
        <p>Here’s how you can get started:</p>
        <ol>
          <li><strong>Sign-In:</strong> Log in or create an account to begin.</li>
          <li><strong>Enter Journal Entries:</strong> Use the journal page to write your thoughts. Gen AI will automatically extract keywords, names, and metadata from your entry and media uploads for easy access later!</li>
          <li><strong>Stored Entries:</strong> Find past entries using metadata and keywords.</li>
          <li><strong>Get Insights:</strong> Receive personalized mental health tips and insights. Gen AI will automatically analyze your information and provide a personalized plan for you!</li>
        </ol>
        <div className="landing-page-buttons">
          <Link to="/authpage">
            <button>Sign Up</button>
          </Link>
          <Link to="/stored-entries">
            <button>Demo: Stored Entries</button>
          </Link>
          <Link to="/insights">
            <button>Demo: Get Insights</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
