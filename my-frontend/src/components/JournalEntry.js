import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SpeechToText from './SpeechToText';
import MediaUpload from './MediaUpload';
import CombinedAnalysis from './CombinedAnalysis';
import MetadataDisplay from './MetadataDisplay';
import { useUser } from '../UserContext';

const JournalEntry = () => {
  const { user } = useUser();
  const [metadata, setMetadata] = useState({
    startTime: null,
    endTime: null,
    duration: null,
    date: '',
    keywords: [],
    names: [],
    text: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mediaAnalysisResults, setMediaAnalysisResults] = useState({
    labels: [],
    texts: []
  });

  const handleMetadataChange = (updatedMetadata) => {
    console.log('Metadata received from SpeechToText:', updatedMetadata);
    const formattedMetadata = {
      ...updatedMetadata,
      date: updatedMetadata.date ? new Date(updatedMetadata.date).toISOString().split('T')[0] : '',
    };
    setMetadata(formattedMetadata);
  };

  const handleMediaSelect = (files) => {
    console.log('Selected files:', files);
    setSelectedFiles(files);
    files.forEach(uploadAndAnalyzeMedia);
  };

  const handleMediaAnalysisResults = (results) => {
    console.log('Media analysis results:', results);
    setMediaAnalysisResults(results);
  };

  const uploadAndAnalyzeMedia = async (file) => {
    const formData = new FormData();
    formData.append('media', file);

    try {
      const response = await fetch('http://localhost:3001/media/analyze-video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Analysis result:', result);
        handleMediaAnalysisResults(result);
      } else {
        console.error('Failed to analyze media');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async () => {
    const combinedKeywords = [...new Set([...metadata.keywords, ...mediaAnalysisResults.labels])];
    const combinedNames = [...new Set([...metadata.names, ...mediaAnalysisResults.texts])];

    const formattedMetadata = {
      ...metadata,
      keywords: combinedKeywords,
      names: combinedNames,
      date: metadata.date ? new Date(metadata.date).toISOString().split('T')[0] : '',
      startTime: metadata.startTime ? new Date(metadata.startTime).toISOString() : null,
      endTime: metadata.endTime ? new Date(metadata.endTime).toISOString() : null,
    };

    const formData = new FormData();
    formData.append('user', user.username);
    formData.append('text', metadata.text);
    formData.append('metadata', JSON.stringify(formattedMetadata));

    selectedFiles.forEach((file) => {
      formData.append('media', file);
    });

    try {
      const response = await fetch('http://localhost:3001/journal-entries', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Journal entry saved successfully');
      } else {
        console.error('Failed to save journal entry');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="journal-entry-container">
      {!user && (
        <div className="auth-message">
          <p>Sign in to enable saving your journal entry</p>
          <Link to="/authpage">Go to Auth Page</Link>
        </div>
      )}
      
      {/* Speech to Text Section */}
      <div className="journal-entry-section">
        <SpeechToText onMetadataChange={handleMetadataChange} />
      </div>

      {/* Media Upload Section */}
      <div className="journal-entry-section">
        <MediaUpload onMediaSelect={handleMediaSelect} />
      </div>

      {/* Metadata Display Section */}
      <div className="journal-entry-section">
        <MetadataDisplay metadata={metadata} mediaAnalysis={mediaAnalysisResults} onMetadataChange={handleMetadataChange} />
      </div>

      {/* Submit Button Section */}
      {user && (
        <div className="submit-section" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default JournalEntry;
