import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export const getTasks = () => api.get('/tasks');
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, updates) => api.patch(`/tasks/${id}`, updates);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
