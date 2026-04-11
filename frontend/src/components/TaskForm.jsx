import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title: title.trim() });
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        id="new-task-input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task…"
        autoComplete="off"
        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 border border-transparent text-sm text-gray-800 placeholder-gray-400 font-medium
                   focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-100
                   transition-all duration-200"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-semibold text-white
                   bg-violet-600 hover:bg-violet-700 active:scale-95
                   disabled:opacity-40 disabled:cursor-not-allowed
                   shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-300
                   transition-all duration-200"
      >
        <Plus size={16} strokeWidth={2.5} />
        Add
      </button>
    </form>
  );
}
