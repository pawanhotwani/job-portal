const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to SQLite database (or create one)
const db = new sqlite3.Database("./users.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create users table if not exists
db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username TEXT UNIQUE, 
        password TEXT
    )`
);

// 🟢 Signup Route
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.send("All fields are required.");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) {
            return res.send("Error: Username might be taken.");
        }
        res.send("Signup successful! <a href='/login.html'>Login here</a>");
    });
});

// 🟢 Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) return res.send("Error occurred.");
        if (!user) return res.send("User not found. <a href='/signup.html'>Sign Up</a>");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.send("Incorrect password.");

        res.send(`Welcome, ${user.username}!`);
    });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



// Create "queries" table if not exists
db.run(
    `CREATE TABLE IF NOT EXISTS queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username TEXT, 
        email TEXT, 
        message TEXT
    )`
);

// 🟢 Query Submission Route
app.post("/submit-query", (req, res) => {
    const { username, email, message } = req.body;
    if (!username || !email || !message) return res.send("All fields are required.");

    db.run(
        "INSERT INTO queries (username, email, message) VALUES (?, ?, ?)",
        [username, email, message],
        (err) => {
            if (err) {
                return res.send("Error saving query.");
            }
            res.send("Query submitted successfully! <a href='/query.html'>Submit another</a>");
        }
    );
});