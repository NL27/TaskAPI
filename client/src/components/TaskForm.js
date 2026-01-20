import TasksAPI from '../servives/tasksAPI';
import TaskList from './TaskList';

class TaskForm {
    constructor(formElement) {
        this._form = formElement;
        this._taskList = new TaskList();
    }

    getCreatedBy() {
        return localStorage.getItem('createdBy') || '';
    }

    setCreatedBy(name) {
        localStorage.setItem('createdBy', name);
    }

    getFormData() {
        const createdBy = document.getElementById('createdBy').value.trim();
        return {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            responsible: document.getElementById('responsible').value.trim(),
            dueDate: document.getElementById('dueDate').value,
            importance: document.getElementById('importance').value,
            createdBy: createdBy,
        };
    }

    async handleSubmit(event) {
        event.preventDefault();

        const taskData = this.getFormData();
        
        // Save creator name to localStorage
        this.setCreatedBy(taskData.createdBy);

        // Add Task to server
        const newTask = await TasksAPI.createTask(taskData);

        // Add Task to List
        this._taskList.addTaskToList(newTask.data.data);
    }

    reset() {
        this._form.reset();
    }
}

export default TaskForm;
