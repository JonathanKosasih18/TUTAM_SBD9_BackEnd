const taskController = require('../controllers/task.controller');
const express = require('express');
const router = express.Router();

router.post('/create', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.get('/user/:user_id', taskController.getTasksByUserId);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;