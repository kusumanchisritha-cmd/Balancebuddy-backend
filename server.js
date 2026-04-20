const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ROOT TEST
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// GET groups
app.get("/api/groups", (req, res) => {
  db.query("SELECT * FROM group_1", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE group
app.post("/api/groups", (req, res) => {
  const { name } = req.body;

  db.query(
    "INSERT INTO group_1 (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Group created ✅" });
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});