const API_URL = '/api/tasks';

async function handleResponse(response) {
    if (!response.ok) {
        // Try to get error message from response body
        try {
            const data = await response.json();
            throw new Error(data.message || `HTTP error ${response.status}`);
        } catch (e) {
            if (e.message) throw e;
            throw new Error(`HTTP error ${response.status}`);
        }
    }
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Request failed');
    return data.data;
}

export async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        return await handleResponse(response);
    } catch (error) {
        console.error('Fetch tasks error:', error);
        throw error;
    }
}

export async function createTask(taskData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Create task error:', error);
        throw error;
    }
}

export async function updateTask(id, taskData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Update task error:', error);
        throw error;
    }
}

export async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Delete task error:', error);
        throw error;
    }
}

export async function toggleTaskComplete(id, completed) {
    return updateTask(id, { completed });
}
