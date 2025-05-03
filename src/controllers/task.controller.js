const baseResponse = require('../utils/baseResponse.util');
const taskRepo = require('../repositories/task.repo');
const userRepo = require('../repositories/user.repo');

exports.createTask = async (req, res) => {
    const user = await userRepo.getUserById(req.body.user_id);
    if (!req.body.title) {
        return baseResponse(res, false, 400, 'Missing required fields', null);
    } else if (!user) {
        return baseResponse(res, false, 401, 'Unauthorized', null);
    }

    try {
        const data = {
            title: req.body.title,
            status: req.body.status || 'PENDING',
            priority: req.body.priority || 'LOW',
            category: req.body.category || 'OTHERS',
            due_date: req.body.due_date || null,
            user_id: user.id,
        };
        const task = await taskRepo.createTask(data);
        baseResponse(res, true, 201, 'Task created successfully', task);
    } catch (error) {
        console.error('Error creating task:', error);
        baseResponse(res, false, 500, 'Internal server error', null);
    }
}

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await taskRepo.getAllTasks();
        baseResponse(res, true, 200, 'Tasks retrieved successfully', tasks);
    } catch (error) {
        console.error('Error getting all tasks:', error);
        baseResponse(res, false, 500, 'Internal server error', null);
    }
}

exports.getTaskById = async (req, res) => {
    try {
        const task = await taskRepo.getTaskById(req.params.id);
        if (!task) {
            return baseResponse(res, false, 404, 'Task not found', null);
        }
        baseResponse(res, true, 200, 'Task retrieved successfully', task);
    } catch (error) {
        console.error('Error getting task by ID:', error);
        baseResponse(res, false, 500, 'Internal server error', null);
    }
}

exports.getTasksByUserId = async (req, res) => {
    try {
        const user = await userRepo.getUserById(req.params.user_id);
        const tasks = await taskRepo.getTasksByUserId(req.params.user_id);
        if (!user) {
            return baseResponse(res, false, 401, 'Unauthorized', null);
        }
        else if (!tasks) {
            return baseResponse(res, false, 404, 'Tasks not found', null);
        }
        baseResponse(res, true, 200, 'Tasks retrieved successfully', tasks);
    } catch (error) {
        console.error('Error getting tasks by user ID:', error);
        baseResponse(res, false, 500, 'Internal server error', null);
    }
}

exports.updateTask = async (req, res) => {
    if (!req.body.title) {
        return baseResponse(res, false, 400, 'Missing required fields', null);
    }
    try {
        const task = await taskRepo.getTaskById(req.params.id);
        if (!task) {
            return baseResponse(res, false, 404, 'Task not found', null);
        }
        const data = {
            title: req.body.title,
            status: req.body.status || task.status,
            priority: req.body.priority || task.priority,
            category: req.body.category || task.category,
            due_date: req.body.due_date || task.due_date,
            id: req.params.id,
        };
        const updatedTask = await taskRepo.updateTask(data);
        baseResponse(res, true, 200, 'Task updated successfully', updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        baseResponse(res, false, 500, 'Internal server error', null);
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const task = await taskRepo.deleteTask(req.params.id);
        if (!task) {
            return baseResponse(res, false, 404, 'Task not found', null);
        }
        baseResponse(res, true, 200, 'Task deleted successfully', task);
    } catch (error) {
        console.error('Error deleting task:', error);
        baseResponse(res, false, 500, 'Internal server error', null);
    }
}
