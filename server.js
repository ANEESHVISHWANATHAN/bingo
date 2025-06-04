const express = require('express');
const path = require('path');
const app = express();

// Serve static files (images, CSS, JS, etc.)
app.use(express.static(__dirname));

// Route for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for profile.html
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

// Route for prelobby.html
app.get('/prelobby', (req, res) => {
  res.sendFile(path.join(__dirname, 'prelobby.html'));
});

// Route for lobby.html
app.get('/lobby', (req, res) => {
  res.sendFile(path.join(__dirname, 'lobby.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
