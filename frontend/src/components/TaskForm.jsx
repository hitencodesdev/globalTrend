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
        placeholder="What needs to be done?"
        autoComplete="off"
        className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-gray-800 placeholder-white/50
                   bg-white/20 border border-white/30 backdrop-blur-sm
                   focus:outline-none focus:bg-white/30 focus:border-white/60
                   transition-all duration-200 text-white"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-bold text-violet-700
                   bg-white hover:bg-violet-50 active:scale-95
                   disabled:opacity-40 disabled:cursor-not-allowed
                   shadow-md transition-all duration-200 whitespace-nowrap"
      >
        <Plus size={16} strokeWidth={2.5} />
        Add
      </button>
    </form>
  );
}
