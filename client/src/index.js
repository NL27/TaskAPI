import './css/style.css';
import Modal from './components/Modal';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskComplete } from './api.js';

class TaskApp {
    constructor() {
        this._taskList = document.getElementById('task-list');
        this._modal = new Modal();
        this._tasks = [];
        
        this._init();
    }

    async _init() {
        this._modal.setOnSubmit(this._handleSaveTask.bind(this));
        await this._loadTasks();
    }

    async _loadTasks() {
        this._taskList.innerHTML = '<div class="loading">Loading tasks...</div>';
        
        try {
            this._tasks = await fetchTasks();
            this._renderTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this._taskList.innerHTML = '<div class="loading">Failed to load tasks. Is the server running?</div>';
        }
    }

    _renderTasks() {
        if (this._tasks.length === 0) {
            this._taskList.innerHTML = '';
            this._taskList.classList.add('empty');
            return;
        }

        this._taskList.classList.remove('empty');
        this._taskList.innerHTML = this._tasks.map(task => this._createTaskCard(task)).join('');
        
        // Add event listeners to all task cards
        this._addTaskEventListeners();
    }

    _createTaskCard(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < new Date() && !task.completed;
        const formattedDate = dueDate ? dueDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: dueDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        }) : 'No date';

        return `
            <div class="task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-id="${task._id}">
                <div class="task-header">
                    <button class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle" data-id="${task._id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                    <div class="task-content">
                        <div class="task-title">${this._escapeHtml(task.title)}</div>
                        ${task.description ? `<div class="task-description">${this._escapeHtml(task.description)}</div>` : ''}
                        <div class="task-meta">
                            <span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                ${this._escapeHtml(task.responsible || 'Unassigned')}
                            </span>
                            <span class="due-date">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                ${formattedDate}
                            </span>
                            <span class="importance importance-${task.importance || 'medium'}">
                                ${this._escapeHtml(task.importance || 'medium')}
                            </span>
                            ${task.createdBy ? `
                            <span class="created-by">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                                ${this._escapeHtml(task.createdBy)}
                            </span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-icon edit" data-action="edit" data-id="${task._id}" title="Edit task">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon delete" data-action="delete" data-id="${task._id}" title="Delete task">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    _addTaskEventListeners() {
        // Use event delegation on the task list
        this._taskList.onclick = async (e) => {
            const button = e.target.closest('[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            const taskId = button.dataset.id;

            switch (action) {
                case 'toggle':
                    await this._handleToggle(taskId);
                    break;
                case 'edit':
                    this._handleEdit(taskId);
                    break;
                case 'delete':
                    await this._handleDelete(taskId);
                    break;
            }
        };
    }

    async _handleSaveTask(formData, taskId) {
        if (taskId) {
            // Update existing task
            const updatedTask = await updateTask(taskId, formData);
            const index = this._tasks.findIndex(t => t._id === taskId);
            if (index !== -1) {
                this._tasks[index] = updatedTask;
            }
        } else {
            // Create new task
            const newTask = await createTask(formData);
            this._tasks.unshift(newTask);
        }
        this._renderTasks();
    }

    async _handleToggle(taskId) {
        const task = this._tasks.find(t => t._id === taskId);
        if (!task) return;

        try {
            const updatedTask = await toggleTaskComplete(taskId, !task.completed);
            const index = this._tasks.findIndex(t => t._id === taskId);
            if (index !== -1) {
                this._tasks[index] = updatedTask;
            }
            this._renderTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }

    _handleEdit(taskId) {
        const task = this._tasks.find(t => t._id === taskId);
        if (task) {
            this._modal.open(task);
        }
    }

    async _handleDelete(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await deleteTask(taskId);
            this._tasks = this._tasks.filter(t => t._id !== taskId);
            this._renderTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TaskApp();
});
