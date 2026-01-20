import tasksAPI from '../servives/tasksAPI';

class TaskList{
    constructor(){
        this._taskList = document.getElementById('task-list');
        this._tasks = [];
        this.getTasks();
        this._validImportance = new Set();
        this._validImportance.add('low');
        this._validImportance.add('medium');
        this._validImportance.add('high');
}

async getTasks(){
    try {
        const response = await tasksAPI.getTasks();
        this._tasks = response.data.data;
        this.render();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

addTaskToList(task){
    this._tasks.push(task);
    this.render();
}

getImportanceClass(importance){
    importance = importance.toLowerCase();
    let importanceClass = '';

    if (this._validImportance.has(importance)) {
        importanceClass = `importance-${importance}`;
    } else {
        importanceClass = ``;
    }
    return importanceClass;
}

render(){
    this._taskList.innerHTML = this._tasks.map(task => {
        const importanceClass = this.getImportanceClass(task.importance);
        return `<div class="task-card">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>${task.responsible}</p>
            <p>${task.dueDate}</p>
            <p class="importance ${importanceClass}">${task.importance}</p>
            <p>${task.completed ? 'Completed' : 'Not Completed'}</p>
            ${task.createdBy ? `<p class="created-by">Created by: ${task.createdBy}</p>` : ''}
        </div>`;
    }).join('');
}
}

export default TaskList;
