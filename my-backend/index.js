const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api'); // Adjust this path if needed
const mediaUploadRoutes = require('./routes/mediaUpload');

const app = express();

app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use('/media', mediaUploadRoutes);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
