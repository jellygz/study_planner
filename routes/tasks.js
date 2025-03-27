const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// All task routes are protected by authMiddleware
router.use(authMiddleware);

// Dashboard (Get all tasks for logged-in user)
router.get("/", async (req, res) => {
    const userId = req.user?.id; // Safe access to req.user
    try {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC",
            [userId]
        );
        res.render("dashboard", { tasks: result.rows, user: req.user });
    } catch (err) {
        console.error("Fetch tasks error:", err);
        console.log("I AM HERE")
        res.status(500).render("500", { title: "Server Error" });
    }
});

// Create a Task
router.post("/add", async (req, res) => {
    const { title, description, due_date } = req.body;
    const userId = req.user?.id;
    if (!title || !due_date) {
        return res.redirect("/tasks"); // No flash message as requested
    }
    try {
        await pool.query(
            "INSERT INTO tasks (user_id, title, description, due_date) VALUES ($1, $2, $3, $4)",
            [userId, title, description, due_date]
        );
        res.redirect("/tasks");
    } catch (err) {
        console.error("Add task error:", err);
        res.status(500).render("500", { title: "Server Error" });
    }
});


// Delete Task Route
router.post("/delete/:id", async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    try {
        // Delete the task where id matches and belongs to the logged-in user
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 AND user_id = $2", 
            [taskId, userId]
        );

        if (result.rowCount === 0) {
            req.flash("error", "Task not found or you are not authorized.");
            return res.redirect("/tasks");
        }

        req.flash("success", "Task deleted successfully.");
        res.redirect("/tasks"); // Redirect back to dashboard or task list
    } catch (err) {
        console.error("❌ Error deleting task:", err);
        req.flash("error", "An error occurred while deleting the task.");
        res.redirect("/tasks");
    }
});

module.exports = router;
