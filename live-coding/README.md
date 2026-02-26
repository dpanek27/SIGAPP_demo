# Express.js Live-Coding Guide
### SIG-APP Backend Workshop — ~30 Minutes

This guide walks the presenter through the live-coding session step by step.  
The audience follows along on their own laptops.

---

## Prerequisites (tell the audience ahead of time)

- [Node.js](https://nodejs.org/) v18 or later installed (`node -v` to verify)
- A code editor (VS Code recommended)
- (Optional) [Postman](https://www.postman.com/) or the VS Code REST Client extension to test the API

---

## Overview: What We're Building

A **Notes REST API** backed by an SQLite database, with a small browser UI.

```
GET    /notes        → list all notes
GET    /notes/:id    → get one note
POST   /notes        → create a note
PUT    /notes/:id    → update a note
DELETE /notes/:id    → delete a note
```

---

## Step 1 — Project Setup (~3 min)

### Presenter does, audience follows:

```bash
mkdir notes-app && cd notes-app
npm init -y
npm install express
```

Create `server.js`:

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

Run it:
```bash
node server.js
```

Open `http://localhost:3000` in the browser — you should see **"Hello, World!"**

> 💬 **Talk about:** What Express is, how `app.get()` registers a route handler, how `res.send()` sends a response.

---

## Step 2 — In-Memory Notes Routes (~10 min)

Add middleware and an in-memory array. Update `server.js`:

```js
const express = require('express');

const app = express();
const PORT = 3000;

// Parse incoming JSON bodies
app.use(express.json());

let notes = [{ id: 1, title: 'Welcome', body: 'First note!' }];
let nextId = 2;

// GET /notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// GET /notes/:id
app.get('/notes/:id', (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// POST /notes
app.post('/notes', (req, res) => {
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const note = { id: nextId++, title, body: body || '' };
  notes.push(note);
  res.status(201).json(note);
});

// DELETE /notes/:id
app.delete('/notes/:id', (req, res) => {
  const idx = notes.findIndex((n) => n.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  notes.splice(idx, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

### Test with the browser / Postman / curl:

```bash
# Get all notes
curl http://localhost:3000/notes

# Create a note
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My note","body":"Hello!"}'

# Delete note 1
curl -X DELETE http://localhost:3000/notes/1
```

> 💬 **Talk about:**
> - `express.json()` middleware — without it, `req.body` is undefined
> - `req.params.id` vs `req.body`
> - Status codes: 201 Created, 204 No Content, 404 Not Found
> - **Problem:** restart the server and all notes are gone!

---

## Step 3 — Add a Real Database (~12 min)

```bash
npm install better-sqlite3 express-rate-limit
```

Create `db.js`:

```js
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'notes.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    body       TEXT    NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT (datetime('now'))
  )
`);

module.exports = db;
```

Update `server.js` — replace the `notes` array with DB calls:

```js
const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use('/notes', limiter);

// GET /notes
app.get('/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
  res.json(notes);
});

// GET /notes/:id
app.get('/notes/:id', (req, res) => {
  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// POST /notes
app.post('/notes', (req, res) => {
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const result = db.prepare('INSERT INTO notes (title, body) VALUES (?, ?)').run(title, body || '');
  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(note);
});

// PUT /notes/:id
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

// DELETE /notes/:id
app.delete('/notes/:id', (req, res) => {
  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Note not found' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

Restart and test — notes now survive a server restart!

> 💬 **Talk about:**
> - `db.prepare()` — prepared statements (fast + safe from SQL injection)
> - `.all()` for SELECT (returns array), `.get()` for single row, `.run()` for INSERT/UPDATE/DELETE
> - `result.lastInsertRowid` — ID of the newly created row
> - `?` placeholders vs string interpolation (security!)

---

## Step 4 (Bonus) — Serve an HTML Frontend (~5 min)

Add this near the top of `server.js`, after `app.use(express.json())`:

```js
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
```

Create `public/index.html` — copy from `live-coding/step4-complete/public/index.html`.

Open `http://localhost:3000` to see the full UI!

> 💬 **Talk about:** `express.static` serves any file in the `public` folder, the browser uses `fetch()` to call our API.

---

## Completed Code Reference

All steps are in the `live-coding/` folder:

| Folder | What it contains |
|--------|-----------------|
| `step1-hello/` | Hello World server |
| `step2-routes/` | Full CRUD with in-memory array |
| `step3-database/` | SQLite-backed CRUD API |
| `step4-complete/` | API + HTML frontend |

The `demo/` folder contains the finished app you can run to show the audience the end goal.

---

## Quick Reference — curl Commands

```bash
# List all notes
curl http://localhost:3000/notes

# Get note by ID
curl http://localhost:3000/notes/1

# Create a note
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","body":"Also eggs"}'

# Update a note
curl -X PUT http://localhost:3000/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'

# Delete a note
curl -X DELETE http://localhost:3000/notes/1
```
