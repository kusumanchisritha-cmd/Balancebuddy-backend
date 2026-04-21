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
      if (err) return res.status(500).json(err);
      res.json({ message: "Group created ✅" });
    }
  );
});

/* ================= USERS ================= */

// CREATE user
app.post("/api/users", (req, res) => {
  const { name, phone } = req.body;

  const user_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Users (user_id, name, phone) VALUES (?, ?, ?)",
    [user_id, name, phone],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User added ✅" });
    }
  );
});

// GET users
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM Users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================= EXPENSES ================= */

// CREATE expense
app.post("/api/expenses", (req, res) => {
  const { expense_name, paid_by, amount } = req.body;

  const expense_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Expenses (expense_id, expense_name, paid_by, amount) VALUES (?, ?, ?, ?)",
    [expense_id, expense_name, paid_by, amount],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Expense added ✅" });
    }
  );
});

// GET expenses
app.get("/api/expenses", (req, res) => {
  db.query("SELECT * FROM Expenses", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================= SETTLEMENTS ================= */

// CREATE settlement
app.post("/api/settlements", (req, res) => {
  const { from_user, to_user, amount } = req.body;

  const settlement_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Settlements (settlement_id, from_user, to_user, amount) VALUES (?, ?, ?, ?)",
    [settlement_id, from_user, to_user, amount],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Settlement added ✅" });
    }
  );
});

// GET settlements
app.get("/api/settlements", (req, res) => {
  db.query("SELECT * FROM Settlements", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
app.post("/api/group_members", (req, res) => {
  const { group_id, user_id } = req.body;

  db.query(
    "INSERT INTO Group_Members (group_id, user_id) VALUES (?, ?)",
    [group_id, user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Member added ✅" });
    }
  );
});
app.get("/api/group_members", (req, res) => {
  const { group_id } = req.query;

  db.query(
    `SELECT gm.group_id, gm.user_id, u.email
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

app.post("/api/expenses", (req, res) => {
  const { expense_name, paid_by, amount } = req.body;

  const sql = `
    INSERT INTO Expenses (expense_name, paid_by, amount)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [expense_name, paid_by, amount], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

  
    res.json({
      message: "Expense created",
      expense_id: result.insertId   // 🔥 THIS LINE FIXES YOUR ERROR
    });
  });
});
/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});