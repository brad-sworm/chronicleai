require('dotenv').config();  // Add this line at the very top

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const mediaUploadRoutes = require('./routes/mediaUpload');
const authRoutes = require('./routes/auth');
const journalEntries = require('./routes/journalEntries'); // Import journalEntries routes
const authenticateToken = require('./middlewares/authMiddleware');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(bodyParser.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.use('/api', apiRoutes);
app.use('/media', mediaUploadRoutes);
app.use('/auth', authRoutes);
app.use('/journal-entries', journalEntries); // Use journalEntries routes

// Secure route example
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route.', user: req.user });
});

// Default route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the backend API');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
