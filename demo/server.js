// server.js — Notes REST API
// Run: npm install && npm start
// Open: http://localhost:3000

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter: max 100 requests per minute per IP
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use('/notes', limiter);

// GET /notes — list all notes
app.get('/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
  res.json(notes);
});

// GET /notes/:id — get a single note
app.get('/notes/:id', (req, res) => {
  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// POST /notes — create a note
app.post('/notes', (req, res) => {
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const result = db
    .prepare('INSERT INTO notes (title, body) VALUES (?, ?)')
    .run(title, body || '');

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(note);
});

// PUT /notes/:id — update a note
app.put('/notes/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Note not found' });

  const { title, body } = req.body;
  db.prepare('UPDATE notes SET title = ?, body = ? WHERE id = ?').run(
    title !== undefined ? title : existing.title,
    body !== undefined ? body : existing.body,
    req.params.id,
  );

  const updated = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /notes/:id — delete a note
app.delete('/notes/:id', (req, res) => {
  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Note not found' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Notes app running at http://localhost:${PORT}`);
});
