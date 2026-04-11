import React, { useState, useEffect } from 'react';
import {
  CheckCheck, Clock, ListTodo, ClipboardList, LayoutDashboard,
  Inbox, Settings, User, AlertCircle, Loader2, Sparkles
} from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm   from './components/TaskForm';
import TaskItem   from './components/TaskItem';

const FILTERS = ['All', 'Active', 'Completed'];

export default function App() {
  const [tasks,        setTasks]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await getTasks();
      setTasks(data);
      setError(null);
    } catch {
      setError('Cannot reach the server — make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (taskData) => {
    try {
      const { data } = await createTask(taskData);
      setTasks(prev => [data, ...prev]);
    } catch { setError('Failed to add task.'); }
  };

  const handleToggle = async (id, completed) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, completed } : t));
    try { await updateTask(id, { completed }); }
    catch { fetchTasks(); setError('Failed to update task.'); }
  };

  const handleEdit = async (id, title) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, title } : t));
    try { await updateTask(id, { title }); }
    catch { fetchTasks(); setError('Failed to edit task.'); }
  };

  const handleDelete = async (id) => {
    setTasks(prev => prev.filter(t => t._id !== id));
    try { await deleteTask(id); }
    catch { fetchTasks(); setError('Failed to delete task.'); }
  };

  const total     = tasks.length;
  const completed = tasks.filter(t =>  t.completed).length;
  const active    = tasks.filter(t => !t.completed).length;
  const percent   = total === 0 ? 0 : Math.round((completed / total) * 100);

  const filtered = tasks.filter(t => {
    if (activeFilter === 'Active')    return !t.completed;
    if (activeFilter === 'Completed') return  t.completed;
    return true;
  });

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] font-sans">

      {/* ════════════════════════════ SIDEBAR ════════════════════════════ */}
      <aside className="fixed left-0 top-0 h-screen w-60 bg-[#1B1F2E] flex flex-col z-30"
             style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <ClipboardList size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none">TaskFlow</p>
            <p className="text-slate-500 text-[10px] mt-0.5 font-medium tracking-wide uppercase">Workspace</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Main</p>

          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Inbox,           label: 'Inbox'     },
            { icon: ListTodo,        label: 'My Tasks'  },
          ].map(({ icon: Icon, label, active: isActive }) => (
            <button key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                          ${isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                          }`}>
              <Icon size={16} />
              {label}
            </button>
          ))}

          {/* Divider */}
          <div className="pt-5 pb-2">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Overview</p>

            {/* Mini stats block */}
            <div className="mx-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCheck size={12} className="text-emerald-400" /> Completed
                </span>
                <span className="text-xs font-bold text-emerald-400">{completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={12} className="text-indigo-400" /> Active
                </span>
                <span className="text-xs font-bold text-indigo-400">{active}</span>
              </div>
              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-slate-500">Progress</span>
                  <span className="text-[10px] font-bold text-slate-400">{percent}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
            <Settings size={16} /> Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <User size={11} className="text-white" />
            </div>
            My Account
          </button>
        </div>
      </aside>

      {/* ════════════════════════════ MAIN ════════════════════════════ */}
      <div className="ml-60 flex-1 flex flex-col">

        {/* ─── Top Bar ─── */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8"
                style={{ boxShadow: '0 1px 0 #e2e8f0' }}>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-none">Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">{today}</p>
          </div>

          <div className="flex items-center gap-3">
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl animate-fade-in">
                <AlertCircle size={13} className="flex-shrink-0" />
                {error}
              </div>
            )}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <User size={14} className="text-white" />
            </div>
          </div>
        </header>

        {/* ─── Page Body ─── */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            {/* Total */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5"
                 style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Tasks</p>
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                  <ListTodo size={18} className="text-slate-500" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-800">{total}</p>
              <p className="text-xs text-slate-400 mt-2">All tasks combined</p>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5"
                 style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Completed</p>
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CheckCheck size={18} className="text-emerald-500" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-emerald-600">{completed}</p>
              <p className="text-xs text-emerald-500 font-medium mt-2">{percent}% completion rate</p>
            </div>

            {/* Remaining */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5"
                 style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Remaining</p>
                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Clock size={18} className="text-indigo-500" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-indigo-600">{active}</p>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Task Board ── */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
               style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.04)' }}>

            {/* Board Header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800">Task List</h2>
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                  {filtered.length} task{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
              <TaskForm onAdd={handleAdd} />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-0 px-6 border-b border-slate-100">
              {FILTERS.map(f => {
                const count = f === 'Active' ? active : f === 'Completed' ? completed : total;
                return (
                  <button
                    key={f}
                    id={`filter-${f.toLowerCase()}`}
                    onClick={() => setActiveFilter(f)}
                    className={`relative px-4 py-3 text-sm font-medium transition-all duration-150
                                ${activeFilter === f
                                  ? 'text-indigo-600'
                                  : 'text-slate-400 hover:text-slate-600'
                                }`}
                  >
                    {f}
                    {count > 0 && (
                      <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                        ${activeFilter === f
                                          ? 'bg-indigo-100 text-indigo-600'
                                          : 'bg-slate-100 text-slate-500'
                                        }`}>
                        {count}
                      </span>
                    )}
                    {activeFilter === f && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Task List Body */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 size={30} className="animate-spin text-indigo-400 mb-3" />
                  <p className="text-sm font-medium">Loading tasks…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">
                    {activeFilter === 'Completed' ? 'No completed tasks yet' : 'No tasks here'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {activeFilter === 'All'
                      ? 'Add a task above to get started.'
                      : `Switch tabs to see other tasks.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(task => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
