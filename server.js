const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");  // Import connect-flash

dotenv.config();
const app = express();

// Set EJS as the view engine and configure layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout"); // default layout file: views/layout.ejs

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Secure Session Management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        httpOnly: true, // Prevent client-side JS from accessing cookies
        maxAge: 3600000 // 1 hour
    }
}));

// Flash Messages Middleware
app.use(flash());

// Set default title and flash messages for views
app.use((req, res, next) => {
    res.locals.title = res.locals.title || 'My App';  // Default title
    res.locals.success_msg = req.flash('success');    // Success message
    res.locals.error_msg = req.flash('error');        // Error message
    next();
});

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Home Route
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// 404 Not Found
app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
});

// Global Error Handling (500 Internal Server Error)
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).render("500", { title: "Server Error" });
});

// Start Server
const PORT = 3002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
