# SIGAPP_demo — Backend Workshop

A 1-hour backend-focused workshop for SIG-APP covering HTTP/APIs, SQL, and a live Express.js coding session.

---

## Workshop Agenda

| Time | Topic |
|------|-------|
| 0:00 – 0:15 | APIs & HTTP |
| 0:15 – 0:30 | SQL basics + [SQLZoo](https://sqlzoo.net/) activity |
| 0:30 – 1:00 | Express.js live demo — Notes App |

---

## Repository Structure

```
slides/
  workshop-slides.md        ← Presenter slides & talking points

demo/
  package.json              ← Dependencies (express, better-sqlite3)
  server.js                 ← Complete Notes REST API
  db.js                     ← SQLite database setup
  public/
    index.html              ← Browser UI for the notes app

live-coding/
  README.md                 ← Step-by-step live-coding guide (START HERE)
  step1-hello/              ← Hello World server
  step2-routes/             ← Full CRUD with in-memory store
  step3-database/           ← Swap to SQLite database
  step4-complete/           ← Final app: API + HTML frontend
```

---

## Quick Start — Run the Finished Demo

> Requires [Node.js](https://nodejs.org/) v18+

```bash
cd demo
npm install
npm start
```

Open **http://localhost:3000** to use the notes app.

---

## Running the Live-Coding Session

See **[live-coding/README.md](live-coding/README.md)** for the full presenter guide including talking points, code snippets for each step, and curl commands to test the API.

---

## Slides

Open **[slides/workshop-slides.md](slides/workshop-slides.md)** for slide content and talking points for all three parts of the workshop.