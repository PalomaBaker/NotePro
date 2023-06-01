const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Helper functions

function getNotesFromFile() {
  const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
  return JSON.parse(data);
}

function writeNotesToFile(notes) {
  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), 'utf8');
}

// HTML routes

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes

app.get('/api/notes', (req, res) => {
  const notes = getNotesFromFile();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  const notes = getNotesFromFile();
  notes.push(newNote);
  writeNotesToFile(notes);

  res.json(newNote);
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
