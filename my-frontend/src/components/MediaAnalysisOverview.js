import React from 'react';

const MediaAnalysisOverview = ({ mediaAnalysis }) => {
  return (
    <div>
      <h3>Media Analysis Overview</h3>
      {mediaAnalysis.map((analysis, index) => (
        <div key={index}>
          <p><strong>Entry {index + 1}</strong></p>
          <p><strong>Labels:</strong> {analysis.labels.join(', ')}</p>
          <p><strong>Texts:</strong> {analysis.texts.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default MediaAnalysisOverview;
