const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Login Page
router.get("/login", (req, res) => {
    console.log("Rendering login page...");
    res.render("login", {
        success_msg: req.flash("success"),
        error_msg: req.flash("error")
    });
});

// Register Page
router.get("/register", (req, res) => {
    console.log("Rendering register page...");
    res.render("register", { 
        error_msg: req.flash("error") 
    });
});

// Handle Registration
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (password.length < 8) {
        req.flash("error", "Password must be at least 8 characters.");
        console.log("Password validation failed.");
        return res.redirect("/auth/register");
    }

    try {
        // Check if email already exists
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            req.flash("error", "Email already exists.");
            console.log("Email already exists:", email);
            return res.redirect("/auth/register");
        }

        // Hash password and insert user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", 
            [name, email, hashedPassword]
        );

        req.flash("success", "You have successfully registered. Please log in.");
        console.log("User registered successfully.");
        res.redirect("/auth/login");

    } catch (err) {
        console.error("Registration error:", err);
        req.flash("error", "An error occurred during registration.");
        res.redirect("/auth/register");
    }
});

// Handle Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the user by email
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/auth/login");
        }

        // Compare password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/auth/login");
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Store the token in session
        req.session.token = token;
        console.log("✅ Token set in session.");

        // Redirect to tasks (or dashboard) after successful login
        res.redirect("/tasks");

    } catch (err) {
        console.error("Login error:", err);
        req.flash("error", "An error occurred during login.");
        res.redirect("/auth/login");
    }
});

// Dashboard Route (Protected)
router.get("/dashboard", authMiddleware, (req, res) => {
    console.log("Accessing dashboard for user:", req.user);
    res.render("dashboard", { user: req.user });
});

// Logout Route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Failed to log out.");
        }
        console.log("✅ Logout successful.");
        res.redirect("/auth/login");
    });
});

module.exports = router;
