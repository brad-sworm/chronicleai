import React, { useState, useEffect, useRef } from 'react';
import MetadataDisplay from './MetadataDisplay';

const SpeechToText = ({ onTranscription, onMetadataChange }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [metadata, setMetadata] = useState({
    startTime: null,
    endTime: null,
    duration: null,
    date: null,
    keywords: [],
    names: [],
    text: '', // Ensure text is included in metadata
  });

  const recognitionRef = useRef(null);

  const createRecognitionInstance = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      console.log('Transcript received:', transcript);
      setText((prevText) => {
        const newText = prevText + ' ' + transcript;
        updateMetadata({ text: newText });
        return newText;
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      recognition.stop();
    };

    recognition.onend = () => {
      console.log('Recognition ended. isListening:', isListening);
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
  };

  const startListening = () => {
    console.log('Starting listening');
    createRecognitionInstance();
    const startTime = metadata.startTime ? metadata.startTime : new Date();
    updateMetadata({
      startTime,
      endTime: null,
      duration: null,
      date: new Date(),
    });
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    console.log('Stopping listening');
    if (recognitionRef.current) {
      const endTime = new Date();
      const duration = endTime - metadata.startTime;
      updateMetadata({
        endTime,
        duration,
      });
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const updateMetadata = (updates) => {
    setMetadata((prev) => {
      const updatedMetadata = { ...prev, ...updates };
      console.log('Updated metadata:', updatedMetadata);
      if (onMetadataChange) {
        onMetadataChange(updatedMetadata);
      }
      return updatedMetadata;
    });
  };

  const extractMetadata = async () => {
    if (!text.trim()) {
      return;
    }

    // Stop listening before extracting metadata
    stopListening();

    console.log('Extracting metadata');
    try {
      const response = await fetch('http://localhost:3001/api/extract-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from backend:', data);

      // Extract and clean keywords and names
      const keywords = Array.isArray(data.keywords) ? data.keywords.filter(kw => kw.trim() !== '') : [];
      const names = Array.isArray(data.names) ? data.names.filter(name => name.trim() !== '') : [];

      if (keywords.length === 0 && names.length === 0) {
        throw new Error('Invalid response: Keywords and Names are empty or undefined');
      }

      // Update metadata with keywords and names
      updateMetadata({
        keywords: keywords.length > 0 ? keywords : metadata.keywords,
        names: names.length > 0 ? names : metadata.names,
      });

    } catch (error) {
      console.error('Error extracting metadata:', error);
    }
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    updateMetadata({ text: newText, endTime: new Date() });
  };

  const handleKeywordsChange = (event) => {
    const keywords = event.target.value.split(',').map(kw => kw.trim());
    updateMetadata({ keywords });
  };

  const handleNamesChange = (event) => {
    const names = event.target.value.split(',').map(name => name.trim());
    updateMetadata({ names });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Speech to Text</h1>
        <div style={{ margin: '20px 0' }}>
          <button onClick={isListening ? stopListening : startListening}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>
        <textarea
          value={text}
          rows="10"
          cols="50"
          onChange={handleTextChange}
          placeholder="You can enter text or click start listening to use the speech to text capability. Your text will appear in this window..."
        />
        <div style={{ margin: '20px 0' }}>
          <button onClick={extractMetadata}>
            Extract Metadata
          </button>
        </div>
      </div>

    </div>
  );
};

export default SpeechToText;

