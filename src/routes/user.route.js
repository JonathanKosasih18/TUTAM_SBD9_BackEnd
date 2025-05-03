const userController = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/:email", userController.getUserByEmail);
router.delete("/:id", userController.deleteUser);

module.exports = router;