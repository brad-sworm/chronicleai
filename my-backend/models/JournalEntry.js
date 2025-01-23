const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const journalEntrySchema = new mongoose.Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
    metadata: { type: Object, default: {} },
    media: { type: [String], default: [] },
  });
  
  // Specify the collection name explicitly
  const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema, 'journalentries');
  
  module.exports = JournalEntry;