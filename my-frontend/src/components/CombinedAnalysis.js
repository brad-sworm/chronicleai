import React, { useState } from 'react';

const CombinedAnalysis = ({ onMetadataChange }) => {
  const [keywords, setKeywords] = useState([]);
  const [names, setNames] = useState([]);

  const fetchKeywordsFromSpeechToText = async () => {
    try {
      const response = await fetch('http://localhost:3001/analyze-speech', { method: 'POST' });
      const data = await response.json();
      setKeywords(data.keywords);
      onMetadataChange({ keywords: data.keywords });
    } catch (error) {
      console.error('Error fetching keywords from speech-to-text:', error);
    }
  };

  const fetchKeywordsFromMedia = async () => {
    try {
      const response = await fetch('http://localhost:3001/analyze-media', { method: 'POST' });
      const data = await response.json();
      setKeywords(data.keywords);
      setNames(data.names);
      onMetadataChange({ keywords: data.keywords, names: data.names });
    } catch (error) {
      console.error('Error fetching keywords from media:', error);
    }
  };

  return (
    <div>
      <h2>Combined Analysis</h2>
      <button onClick={fetchKeywordsFromSpeechToText}>Fetch Keywords from Speech-to-Text</button>
      <button onClick={fetchKeywordsFromMedia}>Fetch Keywords and Names from Media Analysis</button>
      <div>
        <h3>Keywords</h3>
        <ul>
          {keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
        <h3>Names</h3>
        <ul>
          {names.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CombinedAnalysis;
