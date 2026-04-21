const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* ================= GROUPS ================= */
app.get("/api/groups", (req, res) => {
  db.query("SELECT * FROM Groups_1", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/api/groups", (req, res) => {
  const { name } = req.body;
  const group_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Groups_1 (group_id, group_name) VALUES (?, ?)",
    [group_id, name],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Group created ✅", group_id });
    }
  );
});

/* ================= USERS ================= */
app.post("/api/users", (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone required ❌" });
  }

  const user_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Users (user_id, name, phone) VALUES (?, ?, ?)",
    [user_id, name, phone],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User added ✅", user_id });
    }
  );
});

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM Users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================= GROUP MEMBERS ================= */
app.post("/api/group_members", (req, res) => {
  const { group_id, user_id } = req.body;

  db.query(
    "INSERT INTO Group_Members (group_id, user_id) VALUES (?, ?)",
    [group_id, user_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Member added ✅" });
    }
  );
});

app.get("/api/group_members", (req, res) => {
  const { group_id } = req.query;

  db.query(
    `SELECT gm.group_id, gm.user_id, u.name
     FROM Group_Members gm
     JOIN Users u ON gm.user_id = u.user_id
     WHERE gm.group_id = ?`,
    [group_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ================= EXPENSES ================= */
app.post("/api/expenses", (req, res) => {
  const { expense_name, paid_by, amount, group_id } = req.body;

  if (!expense_name || !paid_by || !amount || !group_id) {
    return res.status(400).json({ error: "Missing fields ❌" });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: "Amount must be > 0 ❌" });
  }

  const expense_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Expenses (expense_id, expense_name, paid_by, amount, group_id) VALUES (?, ?, ?, ?, ?)",
    [expense_id, expense_name, paid_by, amount, group_id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Expense added & split created ✅",
        expense_id,
      });
    }
  );
});

app.get("/api/expenses", (req, res) => {
  const { group_id } = req.query;

  db.query(
    "SELECT * FROM Expenses WHERE group_id = ?",
    [group_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ================= SPLITS (🔥 IMPORTANT) ================= */
app.get("/api/splits", (req, res) => {
  const { group_id } = req.query;

  db.query(
    `SELECT es.expense_id, es.user_id, u.name, es.share
     FROM Expense_Split es
     JOIN Users u ON es.user_id = u.user_id
     JOIN Expenses e ON es.expense_id = e.expense_id
     WHERE e.group_id = ?`,
    [group_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});