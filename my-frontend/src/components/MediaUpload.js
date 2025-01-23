import React, { useState } from 'react';

const MediaUpload = ({ onMediaSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    onMediaSelect(files); // Notify parent component of selected files

    // Send each file to the server for analysis
    files.forEach(uploadAndAnalyzeMedia);
  };

  const uploadAndAnalyzeMedia = async (file) => {
    const formData = new FormData();
    formData.append('media', file);
  
    try {
      const response = await fetch('http://localhost:3001/media/analyze-video', { // Adjusted to match the route prefix
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Analysis result:', result);
      } else {
        console.error('Failed to analyze media');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div style={{ margin: '20px 0' }}>
      <h2>Upload Media</h2>
      <input type="file" accept="image/*,audio/*,video/*" multiple onChange={handleFileChange} />
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {selectedFiles.map((file, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <p>Selected File: {file.name}</p>
              {file.type.startsWith('image/') && <img src={URL.createObjectURL(file)} alt="Selected" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
              {file.type.startsWith('audio/') && <audio controls src={URL.createObjectURL(file)} />}
              {file.type.startsWith('video/') && <video controls src={URL.createObjectURL(file)} style={{ maxWidth: '200px', maxHeight: '200px' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
