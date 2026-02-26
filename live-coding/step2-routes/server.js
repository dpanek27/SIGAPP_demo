// Step 2 — In-memory notes routes (no database yet)
// Shows: express.json(), req.body, req.params, res.status()

const express = require('express');

const app = express();
const PORT = 3000;

// Middleware: parse JSON request bodies
app.use(express.json());

// In-memory store (resets when server restarts)
let notes = [
  { id: 1, title: 'Welcome', body: 'This is your first note!' },
];
let nextId = 2;

// GET /notes — list all notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// GET /notes/:id — get a single note
app.get('/notes/:id', (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// POST /notes — create a note
app.post('/notes', (req, res) => {
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const note = { id: nextId++, title, body: body || '' };
  notes.push(note);
  res.status(201).json(note);
});

// PUT /notes/:id — update a note
app.put('/notes/:id', (req, res) => {
  const idx = notes.findIndex((n) => n.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });

  const { title, body } = req.body;
  if (title) notes[idx].title = title;
  if (body !== undefined) notes[idx].body = body;
  res.json(notes[idx]);
});

// DELETE /notes/:id — delete a note
app.delete('/notes/:id', (req, res) => {
  const idx = notes.findIndex((n) => n.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });

  notes.splice(idx, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
