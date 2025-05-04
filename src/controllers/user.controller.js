const baseResponse = require("../utils/baseResponse.util");
const userRepo = require("../repositories/user.repo");
const bcrypt = require("bcryptjs");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*[^\s]{8,})(?=.*\d)(?=.*[^\w\d]).+$/;
const saltRounds = 10;

exports.createUser = async (req, res) => {
    const { username, password, email } = req.body; // ✅ Destructure from req.body

    if (!username || !password || !email) {
        return baseResponse(res, false, 400, "Missing required fields", null);
    }

    try {
        if (!emailRegex.test(email)) {
            return baseResponse(res, false, 400, "Invalid email format", null);
        }

        if (await userRepo.getUserByEmail(email)) {
            return baseResponse(res, false, 400, "Email already registered", null);
        }

        if (!passRegex.test(password)) {
            return baseResponse(res, false, 400, "Password must be at least 8 characters long and contain at least one number and one special character", null);
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = {
            username,
            password: hashedPassword,
            email
        };

        const newUser = await userRepo.createUser(user);
        baseResponse(res, true, 201, "User created successfully", newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        baseResponse(res, false, 500, "Internal server error", null);
    }
}

exports.loginUser = async (req, res) => {
    const { username, password } = req.body; 
    if (!username || !password) {
        return baseResponse(res, false, 400, "Missing required fields", null);
    }

    try {
        const user = await userRepo.loginUser(username, password);
        if (!user) {
            return baseResponse(res, false, 401, "Invalid username or password", null);
        } else {
            baseResponse(res, true, 200, "Login successful", user);
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        baseResponse(res, false, 500, "Internal server error", null);
    }
};


exports.getUserByEmail = async (req, res) => {
    try {
        const user = await userRepo.getUserByEmail(req.params.email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        console.error("Error retrieving user:", error);
        baseResponse(res, false, 500, "Error retrieving user", error);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await userRepo.deleteUser(req.params.id);
        if (!deletedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User deleted successfully", deletedUser);
    } catch (error) {
        console.error("Error deleting user:", error);
        baseResponse(res, false, 500, "Error deleting user", error);
    }
}