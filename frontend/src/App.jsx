import React, { useState, useEffect } from 'react';
import { CheckCheck, AlertCircle, Loader2, ClipboardList } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';

const FILTERS = [
  { label: 'All',       key: 'all' },
  { label: 'Active',    key: 'active' },
  { label: 'Completed', key: 'completed' },
];

export default function App() {
  const [tasks,  setTasks]  = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error'
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setStatus('loading');
      const { data } = await getTasks();
      setTasks(data);
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  };

  const handleAdd = async ({ title }) => {
    try {
      const { data } = await createTask({ title });
      setTasks(prev => [data, ...prev]);
    } catch { /* silent — server already running */ }
  };

  const handleToggle = async (id, completed) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, completed } : t));
    try { await updateTask(id, { completed }); }
    catch { fetchTasks(); }
  };

  const handleDelete = async (id) => {
    setTasks(prev => prev.filter(t => t._id !== id));
    try { await deleteTask(id); }
    catch { fetchTasks(); }
  };

  const total     = tasks.length;
  const done      = tasks.filter(t =>  t.completed).length;
  const remaining = tasks.filter(t => !t.completed).length;

  const visible = tasks.filter(t => {
    if (filter === 'active')    return !t.completed;
    if (filter === 'completed') return  t.completed;
    return true;
  });

  return (
    // Full-page gradient background
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-start justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-lg">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
            <ClipboardList size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-none">My Tasks</h1>
            <p className="text-sm text-gray-400 mt-0.5">Stay on top of your day</p>
          </div>

          {total > 0 && (
            <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
              <CheckCheck size={13} />
              {done}/{total} done
            </span>
          )}
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-100 overflow-hidden">

          {/* Add Task */}
          <div className="p-5 border-b border-gray-100">
            <TaskForm onAdd={handleAdd} />
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div className="h-1 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${Math.round((done / total) * 100)}%` }}
              />
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-100">
            {FILTERS.map(f => (
              <button
                key={f.key}
                id={`filter-${f.key}`}
                onClick={() => setFilter(f.key)}
                className={`flex-1 py-3 text-xs font-semibold tracking-wide uppercase transition-all duration-150 relative
                            ${filter === f.key
                              ? 'text-violet-600'
                              : 'text-gray-400 hover:text-gray-600'}`}
              >
                {f.label}
                {filter === f.key && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-violet-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="p-4 space-y-2 min-h-[200px]">
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Loader2 size={28} className="animate-spin text-violet-400 mb-2" />
                <p className="text-sm">Loading…</p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                <AlertCircle size={16} />
                Cannot connect to server. Is the backend running?
              </div>
            )}

            {status === 'ok' && visible.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl mb-3">✅</span>
                <p className="text-sm font-semibold text-gray-500">
                  {filter === 'completed' ? 'No completed tasks yet.' : 'No tasks here. Add one above!'}
                </p>
              </div>
            )}

            {status === 'ok' && visible.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Footer */}
          {total > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {remaining} task{remaining !== 1 ? 's' : ''} remaining
              </p>
              <button
                onClick={() => tasks.filter(t => t.completed).forEach(t => handleDelete(t._id))}
                className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors duration-150"
              >
                Clear completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
