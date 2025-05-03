const db = require("../database/pg.database");

exports.createTask = async (task) => {
    try {
        const result = await db.query(
            "INSERT INTO tasks (title, status, priority, category, due_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [task.title, task.status, task.priority, task.category, task.due_date, task.user_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error creating task:", error);
    }
}

exports.getAllTasks = async () => {
    try {
        const result = await db.query("SELECT * FROM tasks");
        return result.rows;
    } catch (error) {
        console.error("Error getting all tasks:", error);
    }
}

exports.getTaskById = async (id) => {
    try {
        const result = await db.query(
            "SELECT * FROM tasks WHERE id = $1",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error getting task by ID:", error);
    }
}

exports.getTasksByUserId = async (userId) => {
    try {
        const result = await db.query(
            "SELECT * FROM tasks WHERE user_id = $1",
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error("Error getting tasks by user ID:", error);
    }
}

exports.updateTask = async (task) => {
    try {
        const result = await db.query(
            "UPDATE tasks SET title = $1, status = $2, priority = $3, category = $4, due_date = $5 WHERE id = $6 RETURNING *",
            [task.title, task.status, task.priority, task.category, task.due_date, task.id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

exports.deleteTask = async (id) => {
    try {
        const result = await db.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}