import React, { useState } from 'react';
import { Trash2, Check, Pencil, X, Save } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== task.title) {
      onEdit(task._id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`task-item ${task.completed ? 'completed-task' : ''} slide-in`}>
      {/* Checkbox */}
      <button
        id={`toggle-task-${task._id}`}
        onClick={() => onToggle(task._id, !task.completed)}
        className={`task-checkbox ${task.completed ? 'checked-box' : 'unchecked'}`}
        aria-label="Toggle task"
      >
        {task.completed && <Check size={12} strokeWidth={3} className="text-white" />}
      </button>

      {/* Title / Edit Area */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            className="input-field py-1.5 text-sm"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <p className={`text-sm font-medium truncate transition-all duration-300 ${
            task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}>
            {task.title}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-0.5">Added {formattedDate}</p>
      </div>

      {/* Status Badge */}
      {!isEditing && (
        <span className={`badge hidden sm:inline-flex ${task.completed ? 'badge-green' : 'badge-indigo'}`}>
          {task.completed ? 'Done' : 'In Progress'}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isEditing ? (
          <>
            <button
              id={`save-task-${task._id}`}
              onClick={handleSave}
              className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
              aria-label="Save"
            >
              <Save size={16} />
            </button>
            <button
              onClick={() => { setEditValue(task.title); setIsEditing(false); }}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            {!task.completed && (
              <button
                id={`edit-task-${task._id}`}
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                aria-label="Edit task"
              >
                <Pencil size={16} />
              </button>
            )}
            <button
              id={`delete-task-${task._id}`}
              onClick={() => onDelete(task._id)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
