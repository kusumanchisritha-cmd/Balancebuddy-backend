const express = require("express");
const cors = require("cors");
const db = require("./db"); // import db

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// DB test route
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error ❌" });
    }
    res.json({ message: "Database connected ✅", result });
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
// GET all groups
app.get("/api/groups", (req, res) => {
  db.query("SELECT * FROM groups", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// CREATE group
app.post("/api/groups", (req, res) => {
  const { name } = req.body;

  db.query(
    "INSERT INTO groups (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Group created ✅" });
    }
  );
});