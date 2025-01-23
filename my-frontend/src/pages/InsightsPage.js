import React, { useEffect, useState } from 'react';
import KeywordAnalysis from '../components/KeywordAnalysis';
import SentimentAnalysis from '../components/SentimentAnalysis';
import EntryTimelineWithHeatmaps from '../components/EntryTimeline';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useUser } from '../UserContext';
import '../styles/Insights.css';

const Insights = () => {
  const { user } = useUser();
  const [entries, setEntries] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [mediaAnalysis, setMediaAnalysis] = useState([]);
  const [summary, setSummary] = useState('');
  const [mentalHealthTips, setMentalHealthTips] = useState('');
  const [isStrategyVisible, setIsStrategyVisible] = useState(false);

  const API_URL = 'http://localhost:3001';

  const defaultEntries = [
    {
      text: "Had a fantastic day at work! Got a promotion, feeling on top of the world. Excited for the future!",
      metadata: { keywords: ['work', 'promotion', 'excited', 'future'] },
      mediaAnalysis: { labels: ['Positive'], texts: ['Excited'] },
    },
    {
      text: "It's been a tough week. Struggling with personal issues, feeling a bit lost and overwhelmed.",
      metadata: { keywords: ['tough', 'personal', 'struggling', 'overwhelmed'] },
      mediaAnalysis: { labels: ['Negative'], texts: ['Stressed'] },
    },
    {
      text: "Work was okay today. Not much happened, just the usual. Nothing too exciting or frustrating.",
      metadata: { keywords: ['work', 'usual', 'okay', 'average'] },
      mediaAnalysis: { labels: ['Neutral'], texts: ['Indifferent'] },
    },
  ];

  useEffect(() => {
    if (user) {
      const fetchEntries = async () => {
        try {
          const response = await fetch(`${API_URL}/journal-entries/${user.username}`);
          if (response.ok) {
            const data = await response.json();
            setEntries(data);
            aggregateData(data);
          }
        } catch (error) {
          console.error('Error fetching journal entries:', error);
        }
      };

      fetchEntries();
    } else {
      setEntries(defaultEntries);
      aggregateData(defaultEntries);
    }
  }, [user]);

  const aggregateData = (data) => {
    const allKeywords = data.flatMap((entry) => entry.metadata.keywords);
    setKeywords(allKeywords);

    // Safely extract media analysis labels
    const sentiments = data.flatMap((entry) => {
      const mediaAnalysis = entry.mediaAnalysis || {}; // Ensure mediaAnalysis exists
      return mediaAnalysis.labels || []; // If labels are missing, return an empty array
    });

    const positiveCount = sentiments.filter((label) => label === 'Positive').length;
    const negativeCount = sentiments.filter((label) => label === 'Negative').length;
    const neutralCount = sentiments.filter((label) => label === 'Neutral').length;

    let sentimentSummary = 'Mixed emotions were observed.';
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      sentimentSummary = 'Most entries indicate positive emotions.';
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      sentimentSummary = 'Many entries indicate negative emotions.';
    } else if (neutralCount > positiveCount && neutralCount > negativeCount) {
      sentimentSummary = 'The entries are mostly neutral.';
    }

    setSummary(sentimentSummary);

    // Pass both keywords and sentimentSummary to generateMentalHealthTips
    generateMentalHealthTips(allKeywords, sentimentSummary);
  };

  const generateMentalHealthTips = async (keywords, sentimentSummary) => {
    // Ensure keywords are an array, even if they are joined into a string
    const keywordArray = Array.isArray(keywords) ? keywords : keywords.split(', ');
  
    // Create a focus summary from the most frequent keywords
    const keywordFocus = keywordArray.join(', '); // Use the array for joining
  
    // Fetch personalized recommendations from OpenAI (or your backend system)
    try {
      const response = await axios.post(`${API_URL}/api/mental-health-tips`, {
        keywords: keywordArray, // Send the array instead of a string
        sentimentSummary: sentimentSummary, // Send sentimentSummary as well
      });
      const recommendation = response.data.strategy;
  
      setMentalHealthTips({
        focus: keywordFocus,
        recommendation: recommendation,
      });
    } catch (error) {
      console.error('Error fetching mental health tips:', error);
    }
  };
  

  return (
    <div className="insights-container">
      <h1 className="insights-title">Insights</h1>

      {!user && (
        <div className="card-container">
          <h4>Your data will look something like this:</h4>
          <p>Sign in to see personalized insights based on your entries.</p>
        </div>
      )}

      {mentalHealthTips && (
        <div className="card-container">
          <h2>Your mental health insights:</h2>
          <p>
            Your journal entries tend to be focused on <strong>{mentalHealthTips.focus}</strong>.
            Some recommendations to support your mental health based on your tendencies are:
          </p>
          <p><strong>{mentalHealthTips.recommendation}</strong></p>
        </div>
      )}

      {/* Keyword Analysis */}
      <div className="card-container">
        <KeywordAnalysis keywords={keywords} />
      </div>

      {/* Sentiment Analysis */}
      <div className="card-container">
        <SentimentAnalysis entries={entries} />
      </div>

      {/* Timeline Analysis */}
      <div className="card-container">
        <EntryTimelineWithHeatmaps entries={entries} />
      </div>
    </div>
  );
};

export default Insights;
