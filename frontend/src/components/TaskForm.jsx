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
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 shadow-sm text-gray-700 text-lg"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center transition-colors duration-200 shadow-md"
      >
        <Plus size={20} className="mr-1" /> Add
      </button>
    </form>
  );
};

export default TaskForm;
