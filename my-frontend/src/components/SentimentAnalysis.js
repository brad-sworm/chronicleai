import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const SentimentAnalysis = ({ entries }) => {
  const [sentiments, setSentiments] = useState([]);
  let chartInstance;

  // Default sentiment data for visualization (fluctuating between -1 and 1)
  const defaultSentimentData = [
    0.5, -0.2, 0.7, -0.5, 0.3, 0, -0.8, 1, -0.3, 0.4, // Example fluctuating sentiment values
  ];

  useEffect(() => {
    // Check if entries are available, otherwise use default data
    const sentimentData = (entries && entries.length > 0) 
      ? entries.map(() => Math.random() * 2 - 1) // Random values between -1 and 1
      : defaultSentimentData; // Use default data if no entries

    setSentiments(sentimentData);
  }, [entries]);

  // Prepare the chart data
  const data = {
    labels: Array.from({ length: sentiments.length }, (_, index) => `Entry ${index + 1}`),
    datasets: [
      {
        label: 'Sentiment',
        data: sentiments,
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area under line color
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: -1,
        max: 1,
        ticks: {
          stepSize: 0.5,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const sentiment = tooltipItem.raw;
            return sentiment > 0
              ? `Positive (${sentiment.toFixed(2)})`
              : sentiment < 0
              ? `Negative (${sentiment.toFixed(2)})`
              : `Neutral (${sentiment.toFixed(2)})`;
          },
        },
      },
    },
  };

  useEffect(() => {
    // If chart instance exists, destroy it before creating a new one
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new ChartJS(document.getElementById('sentimentChart').getContext('2d'), {
      type: 'line',
      data: data,
      options: options
    });
    
    return () => {
      chartInstance.destroy();
    };
  }, [data]);

  return (
    <div>
      <h3>Sentiment Analysis</h3>
      <canvas id="sentimentChart"></canvas>
    </div>
  );
};

export default SentimentAnalysis;
