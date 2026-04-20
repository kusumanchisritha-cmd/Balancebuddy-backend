// db.js

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "roundhouse.proxy.rlwy.net",
  user: "root",
  password: "GosnjzHAxpwSqECYpdbNQjtVXNPvdBhX",
  database: "railway",
  port: 30351
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

module.exports = db;