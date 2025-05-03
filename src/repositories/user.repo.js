const db = require("../database/pg.database");
const bcrypt = require("bcryptjs");

exports.createUser = async (user) => {
    try {
        const result = await db.query(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
            [user.username, user.password, user.email]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

exports.loginUser = async (username, password) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        const compare = await bcrypt.compare(password, result.rows[0].password);
        if (!compare) {
            return null;
        }
        else {
            return result.rows[0];
        }
    } catch (error) {
        console.error("Error logging in user:", error);
    }
}

exports.getUserById = async (id) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error getting user by ID:", error);
    }
}

exports.getUserByEmail = async (email) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error getting user by email:", error);
    }
}

exports.deleteUser = async (id) => {
    try {
        const result = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}