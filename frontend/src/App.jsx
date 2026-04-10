import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import { CheckSquare } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const res = await createTask(taskData);
      setTasks([res.data, ...tasks]);
    } catch (err) {
      setError('Failed to add task.');
    }
  };

  const handleToggleTask = async (id, completed) => {
    try {
      // Optimistic update
      setTasks(tasks.map(task => task._id === id ? { ...task, completed } : task));
      await updateTask(id, { completed });
    } catch (err) {
      // Revert on error
      fetchTasks();
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      // Optimistic update
      setTasks(tasks.filter(task => task._id !== id));
      await deleteTask(id);
    } catch (err) {
      // Revert on failure
      fetchTasks();
      setError('Failed to delete task.');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="px-8 py-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare size={32} />
              <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
            </div>
            <p className="text-blue-100 flex justify-between items-center mt-4">
              <span>Stay organized, focused, and productive.</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {completedCount} / {tasks.length} Completed
              </span>
            </p>
          </div>

          <div className="p-8">
            <TaskForm onAdd={handleAddTask} />

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">No tasks yet. Add one to get started!</p>
              </div>
            ) : (
              <div className="space-y-1 mt-4">
                {tasks.map(task => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
