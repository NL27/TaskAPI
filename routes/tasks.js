const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json({success: true, data: tasks});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
});

// Get single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        res.json({success: true, data: task});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
});

// Add a new task
router.post('/', async (req, res) => {
    console.log('POST /api/tasks received:', req.body);
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        responsible: req.body.responsible,
        dueDate: req.body.dueDate,
        importance: req.body.importance || 'medium',
        createdBy: req.body.createdBy,
        completed: false,
    });

    try {
        const savedTask = await task.save();
        res.json({success: true, data: savedTask});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({success: false, message: 'Task not found'});
        }

        // Only update fields that are provided
        if (req.body.title !== undefined) task.title = req.body.title;
        if (req.body.description !== undefined) task.description = req.body.description;
        if (req.body.responsible !== undefined) task.responsible = req.body.responsible;
        if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
        if (req.body.completed !== undefined) task.completed = req.body.completed;
        if (req.body.importance !== undefined) task.importance = req.body.importance;
        if (req.body.createdBy !== undefined) task.createdBy = req.body.createdBy;

        const updatedTask = await task.save();
        res.json({success: true, data: updatedTask});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({success: false, message: 'Task not found'});
        }

        await task.deleteOne();
        res.json({success: true, data: {}});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
});

module.exports = router;
