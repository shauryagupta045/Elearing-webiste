const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser"); // To parse JSON requests
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // This is necessary to handle JSON body

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup", // Make sure this is the correct database name
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("Connected to the database!");
  }
});

// Admin Login route
app.post("/admin/login", (req, res) => {
  const { adminId, password } = req.body;

  // Query to check admin credentials
  const sql = "SELECT * FROM admin WHERE adminId = ? AND password = ?";
  db.query(sql, [adminId, password], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error during admin login", error: err });
    }
    if (data.length === 0) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }
    // Admin login successful
    return res.json({ message: "Admin login successful", data: data[0] });
  });
});

// Signup route
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  const sql = "INSERT INTO login (email, password) VALUES (?, ?)";
  const values = [email, password];

  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json({ message: "Error during signup", error: err });
    }
    return res.json({ message: "User signed up successfully", data });
  });
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, data) => {
    if (err) {
      return res.json({ message: "Error during login", error: err });
    }
    if (data.length === 0) {
      return res.json({ message: "Invalid credentials" });
    }
    return res.json({ message: "Login successful", data });
  });
});

// Server istening
app.listen(3300, () => {
  console.log("Backend running on port 3300");
});
