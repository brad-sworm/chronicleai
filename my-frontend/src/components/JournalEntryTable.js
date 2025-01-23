import React, { useState } from 'react';

const JournalEntryTable = ({ journalEntries, isUserSignedIn }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const constructMediaUrl = (filePath) => {
    return `http://localhost:3001/${filePath.replace(/\\/g, '/')}`;
  };

  const filteredEntries = journalEntries.filter((entry) => {
    const { text, metadata, media } = entry;
    const searchLower = searchTerm.toLowerCase();

    return (
      text.toLowerCase().includes(searchLower) ||
      metadata.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
      metadata.names.some(name => name.toLowerCase().includes(searchLower)) ||
      new Date(metadata.date).toLocaleDateString().toLowerCase().includes(searchLower) ||
      media.some(file => file.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="card-container">

      <input
        type="text"
        className="search-bar"
        placeholder="Search journal entries..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Text</th>
            <th>Keywords</th>
            <th>Names</th>
            <th>Media</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((entry) => (
            <tr key={entry._id}>
              <td>{new Date(entry.metadata.date).toLocaleDateString()}</td>
              <td>{entry.text}</td>
              <td>{entry.metadata.keywords.join(', ')}</td>
              <td>{entry.metadata.names.join(', ')}</td>
              <td>
                {entry.media && entry.media.map((file, index) => (
                  <div key={index}>
                    {file.match(/\.(jpeg|jpg|gif|png)$/i) && (
                      <img src={constructMediaUrl(file)} alt="media" className="media" />
                    )}
                    {file.match(/\.(mp3|wav)$/i) && (
                      <audio controls>
                        <source src={constructMediaUrl(file)} type="audio/mpeg" />
                      </audio>
                    )}
                    {file.match(/\.(mp4|mov)$/i) && (
                      <video controls className="media">
                        <source src={constructMediaUrl(file)} type="video/mp4" />
                      </video>
                    )}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JournalEntryTable;

