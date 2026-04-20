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