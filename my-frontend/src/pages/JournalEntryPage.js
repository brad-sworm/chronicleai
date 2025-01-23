import React from 'react';
import JournalEntry from '../components/JournalEntry';
import '../styles/JournalEntryPage.css'; // Make sure the CSS file is imported
import { useUser } from '../UserContext'; // Import user context

const JournalEntryPage = () => {
  const { user } = useUser(); // Use the user context

  return (
    <div className="journal-entry-page">
      <h1 className="journal-entry-title">Journal Entry</h1>

      {!user && (
        <div className="card-container wide-card">
          <h4 className="bold-header">To create a journal entry:</h4>
          <h4 className="normal-header">Simply type your text or "start listening" to make documenting your entry easy. Click "extract metadata" when done to generate any tags from the entry. Upload any media you have. Gen AI will populate keywords, names, metadata from your content but you can also edit the tags before submitting. Click submit at the bottom of the page to finish.</h4>
        </div>
      )}

      <JournalEntry />
    </div>
  );
};

export default JournalEntryPage;


