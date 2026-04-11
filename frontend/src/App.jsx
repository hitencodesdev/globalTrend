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
  const [status, setStatus] = useState('loading');
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
    } catch {}
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
  const percent   = total === 0 ? 0 : Math.round((done / total) * 100);

  const visible = tasks.filter(t => {
    if (filter === 'active')    return !t.completed;
    if (filter === 'completed') return  t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 flex items-start justify-center px-4 py-14 font-sans">
      <div className="w-full max-w-md">

        {/* ── Header ── */}
        <div className="mb-8 px-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-300">
              <ClipboardList size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none">My Tasks</h1>
              <p className="text-sm text-violet-500 font-medium mt-0.5">Stay on top of your day</p>
            </div>
          </div>

          {total > 0 && (
            <div className="mt-5 flex items-center justify-between text-xs font-semibold text-violet-600 mb-2">
              <span>{done} of {total} completed</span>
              <span>{percent}%</span>
            </div>
          )}
          {total > 0 && (
            <div className="h-2 w-full bg-violet-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
        </div>

        {/* ── Main Card ── */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100 border border-violet-100 overflow-hidden">

          {/* Add Task Section */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-6">
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-3">New Task</p>
            <TaskForm onAdd={handleAdd} />
          </div>

          {/* Completed count bar */}
          {total > 0 && (
            <div className="px-6 py-3 bg-violet-50 border-b border-violet-100 flex items-center gap-2">
              <CheckCheck size={14} className="text-violet-400" />
              <span className="text-xs text-violet-500 font-medium">
                {remaining} task{remaining !== 1 ? 's' : ''} remaining · {done} done
              </span>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/60">
            {FILTERS.map(f => (
              <button
                key={f.key}
                id={`filter-${f.key}`}
                onClick={() => setFilter(f.key)}
                className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-200 relative
                            ${filter === f.key
                              ? 'text-violet-600 bg-white'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-white/60'}`}
              >
                {f.label}
                {filter === f.key && (
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-b-full" />
                )}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="p-5 space-y-2.5 min-h-[220px]">

            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <Loader2 size={28} className="animate-spin text-violet-400" />
                <p className="text-sm font-medium">Loading your tasks…</p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3.5 rounded-2xl">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>Cannot connect to server. Is the backend running on port 5000?</span>
              </div>
            )}

            {status === 'ok' && visible.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-3xl mb-2">
                  {filter === 'completed' ? '🎉' : '📋'}
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  {filter === 'completed' ? 'Nothing completed yet' : 'All clear! Add a task above.'}
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
          {done > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => tasks.filter(t => t.completed).forEach(t => handleDelete(t._id))}
                className="w-full text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 py-2 rounded-xl transition-all duration-200"
              >
                🗑 Clear {done} completed task{done !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-violet-400 font-medium mt-6 opacity-70">
          TaskFlow · Built with React &amp; Express
        </p>
      </div>
    </div>
  );
}
