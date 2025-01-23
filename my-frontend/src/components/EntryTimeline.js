import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/EntryTimeline.css'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EntryTimeline = () => {
  const [entries, setEntries] = useState([]);
  const [entryTimeData, setEntryTimeData] = useState({
    labels: ['Morning', 'Afternoon', 'Night'],
    datasets: [
      {
        label: 'Entries per Time Slot',
        data: [0, 0, 0], // Initial data with zero count
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const [sentimentData, setSentimentData] = useState({
    labels: ['Morning', 'Afternoon', 'Night'],
    datasets: [
      {
        label: 'Positive Sentiment',
        data: [0, 0, 0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Neutral Sentiment',
        data: [0, 0, 0],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'Negative Sentiment',
        data: [0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  });

  // Mock entries (replace with actual data fetching logic)
  const mockEntries = [
    // Morning Entries
    { timestamp: '2025-01-14T07:30:00Z', sentiment: 'positive' },
    { timestamp: '2025-01-14T08:15:00Z', sentiment: 'neutral' },
  
    // Afternoon Entries
    { timestamp: '2025-01-14T12:00:00Z', sentiment: 'positive' },
    { timestamp: '2025-01-14T13:30:00Z', sentiment: 'neutral' },
    { timestamp: '2025-01-14T14:45:00Z', sentiment: 'negative' },
  
    // Night Entries
    { timestamp: '2025-01-14T20:00:00Z', sentiment: 'positive' },
    { timestamp: '2025-01-14T20:30:00Z', sentiment: 'neutral' },
    { timestamp: '2025-01-14T21:00:00Z', sentiment: 'negative' },
    { timestamp: '2025-01-14T21:30:00Z', sentiment: 'positive' },
    { timestamp: '2025-01-14T22:00:00Z', sentiment: 'neutral' },
    { timestamp: '2025-01-14T22:30:00Z', sentiment: 'negative' },
    { timestamp: '2025-01-14T23:00:00Z', sentiment: 'positive' },
    { timestamp: '2025-01-14T23:30:00Z', sentiment: 'neutral' },
    { timestamp: '2025-01-14T23:45:00Z', sentiment: 'negative' },
    { timestamp: '2025-01-14T23:50:00Z', sentiment: 'positive' },
    { timestamp: '2025-01-14T23:55:00Z', sentiment: 'neutral' },
    { timestamp: '2025-01-14T23:59:00Z', sentiment: 'negative' },
    { timestamp: '2025-01-14T23:59:30Z', sentiment: 'positive' },
    { timestamp: '2025-01-14T23:59:59Z', sentiment: 'neutral' },
  ];
  

  useEffect(() => {
    // Log the entries for debugging only on the first render
    console.log('Mock Entries:', mockEntries);

    const entryCounts = { Morning: 0, Afternoon: 0, Night: 0 };
    const sentimentCounts = {
      Morning: { positive: 0, neutral: 0, negative: 0 },
      Afternoon: { positive: 0, neutral: 0, negative: 0 },
      Night: { positive: 0, neutral: 0, negative: 0 },
    };

    // Categorize entries based on time and sentiment
    mockEntries.forEach((entry) => {
      const timeCategory = categorizeTime(entry.timestamp);
      if (!timeCategory) return;

      entryCounts[timeCategory]++;
      sentimentCounts[timeCategory][entry.sentiment]++;

      console.log('Timestamp:', entry.timestamp, 'Time Category:', timeCategory);
    });

    // Prepare entry time data
    setEntryTimeData((prevState) => ({
      ...prevState,
      datasets: [
        {
          ...prevState.datasets[0],
          data: [entryCounts.Morning, entryCounts.Afternoon, entryCounts.Night],
        },
      ],
    }));

    // Prepare sentiment data
    setSentimentData((prevState) => ({
      ...prevState,
      datasets: [
        {
          ...prevState.datasets[0],
          data: [sentimentCounts.Morning.positive, sentimentCounts.Afternoon.positive, sentimentCounts.Night.positive],
        },
        {
          ...prevState.datasets[1],
          data: [sentimentCounts.Morning.neutral, sentimentCounts.Afternoon.neutral, sentimentCounts.Night.neutral],
        },
        {
          ...prevState.datasets[2],
          data: [sentimentCounts.Morning.negative, sentimentCounts.Afternoon.negative, sentimentCounts.Night.negative],
        },
      ],
    }));
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  // Helper function to categorize time
  const categorizeTime = (timestamp) => {
    if (!timestamp) {
      console.error('Timestamp is missing');
      return ''; // Skip or categorize as empty if no timestamp
    }

    const date = new Date(timestamp);
    if (isNaN(date)) {
      console.error(`Invalid timestamp: ${timestamp}`);
      return ''; // Return empty if invalid timestamp
    }

    const hour = date.getHours();
    console.log(`Timestamp: ${timestamp}, Hour: ${hour}`); // Debugging line to check the hour

    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    return 'Night';
  };

  return (
    <div>
      <h2>Entry Timeline</h2>
      <div>
        <h3>Entries per Time Slot</h3>
        <Bar data={entryTimeData} />
      </div>
      <div>
        <h3>Sentiment Distribution per Time Slot</h3>
        <Bar data={sentimentData} />
      </div>
    </div>
  );
};

export default EntryTimeline;
