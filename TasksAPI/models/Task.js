const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    responsible: {
        type: String,
        required: [true, 'Please add someone responsible'],
    },
    dueDate: {
        type: Date,
        required: [true, 'Please add a due date'],
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    importance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    createdBy: {
        type: String,
        required: [true, 'Please add who created the task'],
    },
});

module.exports = mongoose.model('Task', taskSchema);