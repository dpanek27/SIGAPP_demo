# Backend Workshop Slides & Talking Points
### ~1 Hour | SIG-APP

---

## Agenda

| Time | Topic |
|------|-------|
| 0:00 – 0:15 | APIs & HTTP |
| 0:15 – 0:30 | SQL & [SQLZoo](https://sqlzoo.net/) |
| 0:30 – 1:00 | Express.js Live Demo — Notes App |

---

## Part 1 — APIs & HTTP (15 min)

### Slide 1 — What is an API?

**Talking Points:**
- API = **Application Programming Interface**
- A contract that lets two pieces of software talk to each other
- Think of a restaurant: you (client) order from a menu (API), the kitchen (server) prepares the food
- You don't need to know *how* the kitchen works — only what you can order

**Examples to mention:**
- Weather apps pull data from a weather API
- "Sign in with Google" uses Google's OAuth API
- Mobile apps talk to a backend API to load your feed

---

### Slide 2 — HTTP: The Language of the Web

**Talking Points:**
- HTTP = **HyperText Transfer Protocol**
- Every time you visit a website, your browser sends an HTTP **request** and gets a **response**
- HTTP is **stateless** — each request is independent (no memory of previous ones)

**HTTP Request anatomy:**
```
GET /notes HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**HTTP Response anatomy:**
```
HTTP/1.1 200 OK
Content-Type: application/json

[{"id":1,"title":"Hello"}]
```

---

### Slide 3 — HTTP Methods (Verbs)

| Method | Meaning | Example |
|--------|---------|---------|
| **GET** | Read / fetch data | Get all notes |
| **POST** | Create new data | Create a new note |
| **PUT / PATCH** | Update existing data | Edit a note |
| **DELETE** | Remove data | Delete a note |

> 🔑 **Key idea:** The method + URL together describe *what action* you want on *which resource*.

---

### Slide 4 — HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200 OK` | Success |
| `201 Created` | New resource created |
| `400 Bad Request` | Client sent bad data |
| `404 Not Found` | Resource doesn't exist |
| `500 Internal Server Error` | Something broke on the server |

> 💡 Tip: 2xx = good, 4xx = your fault, 5xx = their fault

---

### Slide 5 — REST APIs

**Talking Points:**
- **REST** = Representational State Transfer — a style/convention for structuring APIs
- Resources are identified by URLs: `/notes`, `/notes/1`
- Use HTTP methods to act on them (GET, POST, PUT, DELETE)
- Response is usually JSON

**CRUD ↔ HTTP mapping:**

| CRUD | HTTP | URL |
|------|------|-----|
| Create | POST | `/notes` |
| Read | GET | `/notes` or `/notes/:id` |
| Update | PUT/PATCH | `/notes/:id` |
| Delete | DELETE | `/notes/:id` |

---

## Part 2 — SQL (10–15 min)

### Slide 6 — What is a Database?

**Talking Points:**
- A database is an organized collection of data that persists beyond a single program run
- Two broad types:
  - **Relational (SQL):** data in tables with rows & columns — MySQL, PostgreSQL, SQLite
  - **Non-relational (NoSQL):** flexible documents, key-value, etc. — MongoDB, Redis
- Today we use **SQLite** — a file-based SQL database, zero setup required

---

### Slide 7 — SQL Basics

```sql
-- Create a table
CREATE TABLE notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  body       TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert a row
INSERT INTO notes (title, body) VALUES ('My first note', 'Hello world!');

-- Read all rows
SELECT * FROM notes;

-- Update a row
UPDATE notes SET body = 'Updated!' WHERE id = 1;

-- Delete a row
DELETE FROM notes WHERE id = 1;
```

---

### Slide 8 — SQLZoo Activity 🎮

> **[sqlzoo.net](https://sqlzoo.net/)**

- Work through **Tutorial 0: SELECT basics** together (~5 min)
- Try **Tutorial 1: SELECT name** on your own (~5 min)

These cover the `SELECT` statement, `WHERE`, `LIKE`, and basic filtering — exactly what we'll use in the demo.

---

## Part 3 — Express.js Live Demo (30 min)

### Slide 9 — What is Node.js & Express?

**Talking Points:**
- **Node.js** — JavaScript runtime outside the browser, powered by Chrome's V8 engine
- **Express.js** — minimal, fast web framework for Node.js
- You can build a full HTTP server in ~10 lines of code
- Most popular backend framework in the JavaScript ecosystem

---

### Slide 10 — Today's Project: Notes API

We're building a **REST API** for a simple notes app:

```
GET    /notes        → list all notes
GET    /notes/:id    → get one note
POST   /notes        → create a note
PUT    /notes/:id    → update a note
DELETE /notes/:id    → delete a note
```

Stack:
- **Express.js** — HTTP server & routing
- **better-sqlite3** — SQLite database (synchronous, simple)
- **Postman / browser** — test the API

---

### Slide 11 — Step-by-Step Plan

1. `npm init` and install Express
2. "Hello World" — verify Express is running
3. Add in-memory notes routes (GET + POST)
4. Add an SQLite database
5. Wire up all CRUD routes
6. *(Bonus)* Serve a simple HTML frontend

---

### Slide 12 — Key Concepts to Point Out During Demo

- `app.get()`, `app.post()`, `app.put()`, `app.delete()` — route handlers
- `req.params` — URL parameters (e.g., `:id`)
- `req.body` — JSON body from POST/PUT (needs `express.json()` middleware)
- `res.json()` — send a JSON response
- `res.status(404).json(...)` — set status code + send JSON
- Database prepared statements prevent SQL injection

---

### Slide 13 — Resources

| Resource | Link |
|----------|------|
| Express docs | https://expressjs.com/ |
| SQLite / better-sqlite3 | https://github.com/WiseLibs/better-sqlite3 |
| SQLZoo | https://sqlzoo.net/ |
| HTTP status codes | https://httpstatuses.io/ |
| Postman (API testing) | https://www.postman.com/ |
| MDN HTTP overview | https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview |

---

*End of slides — questions?*
