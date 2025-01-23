import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useUser } from '../UserContext'; // Import the useUser hook

// Registering necessary Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const KeywordAnalysis = () => {
  const { user } = useUser(); // Get user data from UserContext
  const [journalEntries, setJournalEntries] = useState([]);
  const [keywordCounts, setKeywordCounts] = useState({});

  // Default hardcoded keywords and counts to match the default data
  const defaultKeywords = ['stressed', 'overwhelmed', 'tough', 'personal', 'work', 'future', 'neutral'];
  const defaultCounts = [5, 4, 3, 3, 2, 1, 1]; // Emphasizing negative sentiment

  // Function to count keyword occurrences in the journal entries
  const countKeywords = (entries) => {
    const keywordCount = {};

    // Loop through each journal entry and its keywords
    entries.forEach((entry) => {
      entry.metadata.keywords.forEach((keyword) => {
        // Increment keyword count or initialize it if not present
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });

    return keywordCount;
  };

  useEffect(() => {
    console.log('User data from context:', user); // Debugging user data

    if (user && user.username) {
      // Fetch journal entries if the user is signed in
      const fetchJournalEntries = async () => {
        try {
          const response = await fetch(`http://localhost:3001/journal-entries/${user.username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch journal entries');
          }
          const data = await response.json();
          console.log('Fetched Journal Entries:', data);
          setJournalEntries(data);

          // Count keywords from the journal entries
          const counts = countKeywords(data);
          setKeywordCounts(counts);
        } catch (error) {
          console.error('Error fetching journal entries:', error);
        }
      };

      fetchJournalEntries();
    } else {
      // Use default keyword counts if not signed in
      setKeywordCounts(
        defaultKeywords.reduce((acc, keyword, index) => {
          acc[keyword] = defaultCounts[index];
          return acc;
        }, {})
      );
      console.log('Using default keyword counts:', defaultCounts); // Debugging default counts
    }
  }, [user]); // Re-run effect when user changes

  // Prepare chart data
  const keywords = Object.keys(keywordCounts);
  const counts = keywords.map((keyword) => keywordCounts[keyword]);

  const chartData = {
    labels: keywords,
    datasets: [
      {
        label: 'Keyword Count',
        data: counts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Negative sentiment color
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Keyword Analysis',
      },
    },
  };

  return (
    <div>
      {/* Rendering the Bar chart */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default KeywordAnalysis;
