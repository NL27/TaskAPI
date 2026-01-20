import axios from 'axios';

class TasksAPI{
    constructor(){
        // this._apiUrl = 'http://localhost:3000/api/tasks';
        this._apiUrl = 'api/tasks'; // for production
    }

    getTasks(){
        return axios.get(this._apiUrl);
        // const response = await fetch(this._apiUrl);
        // return response.json();
    }

    createTask(taskData){
        return axios.post(this._apiUrl, taskData);
    }
}

export default new TasksAPI();