const express = require('express');
const multer = require('multer');
const fs = require('fs');
<<<<<<< HEAD
require('dotenv').config();  // Load environment variables
=======
const path = require('path');
>>>>>>> 66973b98958354c77c61e8130d8f436678df6649
const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const videoClient = new VideoIntelligenceServiceClient({
<<<<<<< HEAD
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE  // Use the absolute path directly
=======
  projectId: 'thinking-digit-447719-e5',
  keyFilename: path.join(__dirname, '../../thinking-digit-447719-e5-0ba1a8c42514.json') // Adjust this path
>>>>>>> 66973b98958354c77c61e8130d8f436678df6649
});

router.post('/analyze-video', upload.single('media'), async (req, res) => {
  try {
    console.log('Received request for video analysis');
    console.log('File uploaded:', req.file);

    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const videoPath = req.file.path;

    // Read the video file and encode it to base64
    const inputContent = fs.readFileSync(videoPath).toString('base64');
    console.log('Video file read and encoded');

    const request = {
      inputContent,
      features: ['LABEL_DETECTION', 'TEXT_DETECTION'],
    };
    console.log('Sending request to Google Cloud Video Intelligence API');

    // Make request to Video Intelligence API
    const [operation] = await videoClient.annotateVideo(request);
    const [operationResult] = await operation.promise();
    console.log('Received response from API');

    // Process the results
    const annotations = operationResult.annotationResults[0];
    const labels = annotations.segmentLabelAnnotations.map(label => label.entity.description);
    const texts = annotations.textAnnotations.map(text => text.text);
    console.log('Labels:', labels);
    console.log('Texts:', texts);

    fs.unlinkSync(videoPath); // Clean up the uploaded file
    console.log('Temporary file deleted');

    res.json({ labels, texts });
  } catch (error) {
<<<<<<< HEAD
    console.error('Error analyzing video:', error.message);
    res.status(500).send({ error: error.message });
=======
    console.error('Error analyzing video:', error);
    res.status(500).send('Error analyzing video');
>>>>>>> 66973b98958354c77c61e8130d8f436678df6649
  }
});

module.exports = router;

<<<<<<< HEAD

=======
>>>>>>> 66973b98958354c77c61e8130d8f436678df6649
