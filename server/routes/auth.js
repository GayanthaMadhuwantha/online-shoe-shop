const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Database connection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const SECRET_KEY = "Backend_secret_key_New"; 

  

// ✅ USER REGISTRATION
router.post("/register", async (req, res) => {
    const { FName, LName, Address, Email, Password, Role, PhoneNumber } = req.body;

    // Validate input
    if (!FName || !LName || !Email || !Password || !Role || !PhoneNumber) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Insert user into the database
        const query = "INSERT INTO User (FName, LName, Name, Address, Email, Password, Role, PhoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const fullName = `${FName} ${LName}`;

        db.query(query, [FName, LName, fullName, Address, Email, hashedPassword, Role, PhoneNumber], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ error: "Email or Phone Number already exists!" });
                }
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error!" });
            }

            res.status(201).json({ message: "User registered successfully!" });
        });

    } catch (error) {
        console.error("Hashing error:", error);
        res.status(500).json({ error: "Server error!" });
    }
});

// ✅ USER LOGIN
router.post("/login", (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ error: "Email and Password are required!" });
    }

    // Find user by email
    const query = "SELECT * FROM User WHERE Email = ?";
    db.query(query, [Email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error!" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid Email or Password!" });
        }

        const user = results[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Email or Password!" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userID: user.UserID, name: user.Name, email: user.Email, role: user.Role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful!", token, user });
    });
});

// ✅ GET USER PROFILE (Optional)
router.get("/profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized access!" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.status(200).json({ user: decoded });
    } catch (error) {
        res.status(401).json({ error: "Invalid token!" });
    }
});

module.exports = router;
