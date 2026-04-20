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
  db.query("SELECT * FROM Groups_1", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE group
app.post("/api/groups", (req, res) => {
  const { name } = req.body;

  const group_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Groups_1 (group_id, group_name) VALUES (?, ?)",
    [group_id, name],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Group created ✅" });
    }
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});