const fs = require('fs');
const path = require('path');

// Helper function to create folders and files without overwriting
const createStructure = (basePath, structure) => {
  Object.entries(structure).forEach(([name, content]) => {
    const fullPath = path.join(basePath, name);
    if (typeof content === 'object') {
      // Create folder if it doesn't exist
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created folder: ${fullPath}`);
      }
      createStructure(fullPath, content); // Recursive call for nested structure
    } else if (typeof content === 'string') {
      // Create file if it doesn't exist
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content);
        console.log(`Created file: ${fullPath}`);
      }
    }
  });
};

// Define the folder and file structure
const structure = {
  'my-backend': {
    // Backend structure here...
  },
  'my-front-end': {
    'src': {
      'components': {},
      'pages': {},
      'services': {
        'api.js': '// API calls to backend\n',
      },
      'styles': {},
      'App.js': '// Root React component\n',
      'index.js': '// ReactDOM.render entry point\n',
    },
    'public': {},
    '.env': '# Shared environment variables\n',
    'README.md': '# Memory App\nThis is the Memory App project.',
  },
};

// Merge the structure with existing folders
createStructure(__dirname, structure);
console.log('Updated project structure successfully!');

