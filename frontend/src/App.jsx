import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import {
  LayoutDashboard, CheckCheck, Clock, ListTodo,
  Inbox, AlertCircle, Loader2, ClipboardList, Settings, User
} from 'lucide-react';

const FILTERS = ['All', 'Active', 'Completed'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

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
      setError('Unable to connect. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const res = await createTask(taskData);
      setTasks([res.data, ...tasks]);
    } catch {
      setError('Failed to add task. Please try again.');
    }
  };

  const handleToggleTask = async (id, completed) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, completed } : t));
    try {
      await updateTask(id, { completed });
    } catch {
      fetchTasks();
      setError('Failed to update task.');
    }
  };

  const handleEditTask = async (id, title) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, title } : t));
    try {
      await updateTask(id, { title });
    } catch {
      fetchTasks();
      setError('Failed to edit task.');
    }
  };

  const handleDeleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t._id !== id));
    try {
      await deleteTask(id);
    } catch {
      fetchTasks();
      setError('Failed to delete task.');
    }
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'Active') return !t.completed;
    if (activeFilter === 'Completed') return t.completed;
    return true;
  });

  return (
    <div className="flex min-h-screen">

      {/* ——— Sidebar ——— */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="px-5 pt-7 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <ClipboardList size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">TaskFlow</p>
              <p className="text-slate-500 text-xs">Professional</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest px-3 mb-3">Menu</p>
          <div className="sidebar-nav-item active">
            <LayoutDashboard size={18} />
            Dashboard
          </div>
          <div className="sidebar-nav-item">
            <Inbox size={18} />
            Inbox
          </div>
          <div className="sidebar-nav-item">
            <ListTodo size={18} />
            My Tasks
          </div>

          <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest px-3 pt-6 mb-3">Overview</p>
          {/* Mini Stats in Nav */}
          <div className="mx-1 bg-white/5 rounded-xl p-3 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5"><CheckCheck size={13} className="text-green-400" /> Completed</span>
              <span className="text-white font-semibold">{completed}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5"><Clock size={13} className="text-indigo-400" /> Active</span>
              <span className="text-white font-semibold">{active}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 text-right">{percent}% done</p>
          </div>
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <div className="sidebar-nav-item">
            <Settings size={18} />
            Settings
          </div>
          <div className="sidebar-nav-item">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <User size={13} className="text-white" />
            </div>
            My Account
          </div>
        </div>
      </aside>

      {/* ——— Main Content ——— */}
      <main className="main-content flex flex-col">
        
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {error && (
              <span className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                <AlertCircle size={13} /> {error}
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <User size={15} className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-5">
            <div className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-800">{total}</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <ListTodo size={20} className="text-slate-500" />
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-400">Across all lists</div>
            </div>

            <div className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completed}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCheck size={20} className="text-green-500" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-500 font-medium">{percent}% completion rate</div>
            </div>

            <div className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Remaining</p>
                  <p className="text-3xl font-bold text-indigo-600">{active}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-indigo-500" />
                </div>
              </div>
              <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Task Board */}
          <div className="card">
            <div className="px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-800">All Tasks</h2>
                <span className="badge badge-indigo">{filteredTasks.length} tasks</span>
              </div>
              <TaskForm onAdd={handleAddTask} />
            </div>

            {/* Filter Tabs */}
            <div className="px-6 pt-4 flex items-center gap-1 border-b border-slate-100 pb-0">
              {FILTERS.map(f => (
                <button
                  key={f}
                  id={`filter-${f.toLowerCase()}`}
                  onClick={() => setActiveFilter(f)}
                  className={`text-sm font-medium px-4 py-2.5 border-b-2 transition-all duration-200 ${
                    activeFilter === f
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                  {f === 'Active' && active > 0 && (
                    <span className="ml-2 text-xs bg-indigo-50 text-indigo-600 font-semibold px-1.5 py-0.5 rounded-full">{active}</span>
                  )}
                  {f === 'Completed' && completed > 0 && (
                    <span className="ml-2 text-xs bg-green-50 text-green-600 font-semibold px-1.5 py-0.5 rounded-full">{completed}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Loader2 size={32} className="animate-spin mb-3 text-indigo-400" />
                  <p className="text-sm font-medium">Loading your tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCheck size={28} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">
                    {activeFilter === 'Completed' ? 'No completed tasks yet' : 'No tasks here'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {activeFilter === 'All' ? 'Add your first task using the form above.' : `Switch to "All" to see all tasks.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
