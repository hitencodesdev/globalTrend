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
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        id="new-task-input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task and press Enter..."
        className="input-field flex-1"
        autoComplete="off"
      />
      <button
        id="add-task-btn"
        type="submit"
        disabled={!title.trim()}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Plus size={18} strokeWidth={2.5} />
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
