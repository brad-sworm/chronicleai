import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import JournalEntryTable from '../components/JournalEntryTable';
import KeywordAnalysis from '../components/KeywordAnalysis'; // Import KeywordAnalysis
import '../styles/Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const { user } = useUser();
  console.log('User data:', user); // Log user data to see if it's being set

  const [journalEntries, setJournalEntries] = useState([]);
  
  // Default demo journal entries when no user is signed in
  const demoEntries = Array.from({ length: 10 }, (_, index) => ({
    _id: index.toString(),
    text: `Sample journal entry number ${index + 1}. This is a demonstration entry.`,
    metadata: {
      date: new Date().toISOString(),
      keywords: ['demo', 'test', 'sample'],
      names: ['John Doe'],
    },
    media: [],
  }));

  useEffect(() => {
    const fetchJournalEntries = async () => {
      if (user && user.username) {
        try {
          const response = await fetch(`http://localhost:3001/journal-entries/${user.username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch journal entries');
          }
          const data = await response.json();
          console.log('Journal Entries from Backend:', data);
          setJournalEntries(data);
        } catch (error) {
          console.error(error.message);
        }
      } else {
        // Show default demo entries when no user is signed in
        setJournalEntries(demoEntries);
      }
    };

    fetchJournalEntries();
  }, [user]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Stored Entries
      </h1>

      {/* Show mock data container when the user is not signed in */}
      {!user && (
        <div className="card-container">
          <h4>Your data will look something like this:</h4>
          <p>Sign in to a searchable table based on your journal entries.</p>
        </div>
      )}

      <div className="card-container">
        <JournalEntryTable journalEntries={journalEntries} />
      </div>
    </div>
  );
};

export default Dashboard;
