import React from 'react';

const MetadataDisplay = ({ metadata, mediaAnalysis = { labels: [], texts: [] }, onMetadataChange }) => {
  const { startTime, endTime, duration, date, keywords, names } = metadata;
  const combinedKeywords = [...new Set([...keywords, ...mediaAnalysis.labels])];
  const combinedNames = [...new Set([...names, ...mediaAnalysis.texts])];

  const formatTime = (time) => {
    return time ? new Date(time).toLocaleTimeString() : 'N/A';
  };

  const formatDate = (time) => {
    return time ? new Date(time).toLocaleDateString() : 'N/A';
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const seconds = Math.floor(duration / 1000);
    return `${seconds} seconds`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onMetadataChange({ ...metadata, [name]: value });
  };

  return (
    <div>
      <h2>Recording Metadata</h2>
      <p>
        <strong>Date:</strong>
        <input
          type="date"
          name="date"
          value={date ? new Date(date).toISOString().split('T')[0] : ''}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <strong>Start Time:</strong>
        <input
          type="text"
          name="startTime"
          value={startTime ? formatTime(startTime) : ''}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <strong>End Time:</strong>
        <input
          type="text"
          name="endTime"
          value={endTime ? formatTime(endTime) : ''}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <strong>Duration:</strong>
        <input
          type="text"
          name="duration"
          value={duration ? formatDuration(duration) : ''}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <strong>Names:</strong>
        <input
          type="text"
          name="names"
          value={combinedNames.length > 0 ? combinedNames.join(', ') : ''}
          onChange={(e) => handleInputChange({ target: { name: 'names', value: e.target.value.split(',').map(name => name.trim()) } })}
        />
      </p>
      <p>
        <strong>Keywords:</strong>
        <input
          type="text"
          name="keywords"
          value={combinedKeywords.length > 0 ? combinedKeywords.join(', ') : ''}
          onChange={(e) => handleInputChange({ target: { name: 'keywords', value: e.target.value.split(',').map(kw => kw.trim()) } })}
        />
      </p>
    </div>
  );
};

export default MetadataDisplay;
