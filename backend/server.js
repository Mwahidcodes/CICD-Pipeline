const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.log("Database connection error:", err.message);
  } else {
    console.log("SQLite database connected");
  }
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API test route
app.get("/api", (req, res) => {
  res.json({
    message: "Note App API is running"
  });
});

// READ all notes
app.get("/api/notes", (req, res) => {
  const sql = "SELECT * FROM notes ORDER BY id DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to get notes"
      });
    }

    res.json(rows);
  });
});

// CREATE note
app.post("/api/notes", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required"
    });
  }

  const sql = "INSERT INTO notes (title, description) VALUES (?, ?)";

  db.run(sql, [title, description], function (err) {
    if (err) {
      return res.status(500).json({
        message: "Failed to create note"
      });
    }

    res.status(201).json({
      message: "Note created successfully",
      note: {
        id: this.lastID,
        title,
        description
      }
    });
  });
});

// UPDATE note
app.put("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required"
    });
  }

  const sql = "UPDATE notes SET title = ?, description = ? WHERE id = ?";

  db.run(sql, [title, description, id], function (err) {
    if (err) {
      return res.status(500).json({
        message: "Failed to update note"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json({
      message: "Note updated successfully"
    });
  });
});

// DELETE note
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM notes WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete note"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json({
      message: "Note deleted successfully"
    });
  });
});

// Serve React frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});