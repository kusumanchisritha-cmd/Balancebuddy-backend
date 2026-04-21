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
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Group created ✅", group_id });
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
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User added ✅", user_id });
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

/* ================= GROUP MEMBERS ================= */

// ADD MEMBER
app.post("/api/group_members", (req, res) => {
  const { group_id, user_id } = req.body;

  if (!group_id || !user_id) {
    return res.status(400).json({ error: "Missing fields ❌" });
  }

  // Check user exists
  db.query(
    "SELECT user_id FROM Users WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found ❌" });
      }

      db.query(
        "INSERT INTO Group_Members (group_id, user_id) VALUES (?, ?)",
        [group_id, user_id],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Member added ✅" });
        }
      );
    }
  );
});

// GET MEMBERS
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

// CREATE expense
app.post("/api/expenses", (req, res) => {
  const { expense_name, paid_by, amount, group_id } = req.body;

  if (!expense_name || !paid_by || !amount || !group_id) {
    return res.status(400).json({ error: "Missing fields ❌" });
  }

  const expense_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Expenses (expense_id, expense_name, paid_by, amount, group_id) VALUES (?, ?, ?, ?, ?)",
    [expense_id, expense_name, paid_by, amount, group_id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Expense added ✅",
        expense_id
      });
    }
  );
});

// GET expenses (group-wise)
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

/* ================= EXPENSE SPLIT ================= */

// SPLIT expense equally
app.post("/api/expense_split", (req, res) => {
  const { expense_id, users } = req.body;

  if (!expense_id || !users || users.length === 0) {
    return res.status(400).json({ error: "Invalid data ❌" });
  }

  const share = 1 / users.length;

  users.forEach((user_id) => {
    db.query(
      "INSERT INTO Expense_Split (expense_id, user_id, share_amount) VALUES (?, ?, ?)",
      [expense_id, user_id, share],
      (err) => {
        if (err) console.error(err);
      }
    );
  });

  res.json({ message: "Expense split successfully ✅" });
});

/* ================= SETTLEMENTS ================= */

// CREATE settlement
app.post("/api/settlements", (req, res) => {
  const { from_user, to_user, amount } = req.body;
  const settlement_id = Math.floor(Math.random() * 100000);

  db.query(
    "INSERT INTO Settlements (settlement_id, from_user, to_user, amount) VALUES (?, ?, ?, ?)",
    [settlement_id, from_user, to_user, amount],
    (err) => {
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

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});