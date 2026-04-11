import React from 'react';
import { Check, Trash2 } from 'lucide-react';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-enter group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200
                    ${task.completed
                      ? 'bg-gray-50 border-gray-100'
                      : 'bg-white border-gray-200 hover:border-violet-200 hover:shadow-sm'}`}>

      {/* Checkbox */}
      <button
        id={`toggle-${task._id}`}
        onClick={() => onToggle(task._id, !task.completed)}
        aria-label="Toggle task"
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${task.completed
                      ? 'bg-violet-600 border-violet-600'
                      : 'border-gray-300 hover:border-violet-500 bg-white'}`}
      >
        {task.completed && <Check size={10} strokeWidth={3.5} className="text-white" />}
      </button>

      {/* Title */}
      <span className={`flex-1 text-sm font-medium transition-all duration-200
                        ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {task.title}
      </span>

      {/* Delete */}
      <button
        id={`delete-${task._id}`}
        onClick={() => onDelete(task._id)}
        aria-label="Delete task"
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
