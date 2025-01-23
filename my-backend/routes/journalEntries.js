const express = require('express');
const multer = require('multer');
const JournalEntry = require('../models/JournalEntry');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/', upload.array('media'), async (req, res) => {
  try {
    console.log('Received data:', req.body);
    console.log('Received files:', req.files);

    const { user, text, metadata } = req.body;

    if (!user || !text) {
      return res.status(400).json({ error: 'User and text fields are required.' });
    }

    const media = req.files ? req.files.map(file => file.path) : [];
    let parsedMetadata = metadata ? JSON.parse(metadata) : {};
    const { startTime, endTime, keywords = [], names = [] } = parsedMetadata;

    parsedMetadata = {
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: endTime ? new Date(endTime).toISOString() : null,
      date: parsedMetadata.date || new Date().toISOString(),
      keywords: Array.isArray(keywords) ? keywords : [],
      names: Array.isArray(names) ? names : [],
    };

    console.log('Parsed metadata:', parsedMetadata);

    const journalEntry = new JournalEntry({
      user,
      text,
      metadata: parsedMetadata,
      media,
    });

    await journalEntry.save();
    res.status(201).json(journalEntry);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:username', async (req, res) => {
  console.log('Received GET request for:', req.params.username);
  const { username } = req.params;

  try {
    const journalEntries = await JournalEntry.find({ user: username });

    if (!journalEntries || journalEntries.length === 0) {
      return res.status(404).json({ success: false, message: 'No journal entries found' });
    }

    res.json(journalEntries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journal entries' });
  }
});

module.exports = router;
