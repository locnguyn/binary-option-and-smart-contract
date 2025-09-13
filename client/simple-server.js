const express = require('express');
const path = require('path');
const app = express();
const port = 4200;

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Handle Angular routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log(`Simple server running at http://localhost:${port}`);
});
