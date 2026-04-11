import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title: title.trim() });
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        id="new-task-input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Type a task and press Enter…"
        autoComplete="off"
        className="flex-1 h-11 px-4 text-sm font-medium text-slate-700 placeholder-slate-400
                   bg-slate-50 border border-slate-200 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
                   transition-all duration-200"
      />
      <button
        id="add-task-btn"
        type="submit"
        disabled={!title.trim()}
        className="inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold text-white
                   bg-indigo-600 hover:bg-indigo-700 active:scale-95
                   rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                   transition-all duration-200 whitespace-nowrap"
      >
        <Plus size={16} strokeWidth={2.5} />
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
