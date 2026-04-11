import React from 'react';
import { Check, Trash2 } from 'lucide-react';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-enter group flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-200
                    ${task.completed
                      ? 'bg-gray-50 border-gray-100'
                      : 'bg-white border-gray-100 hover:border-violet-200 hover:shadow-md hover:shadow-violet-50 hover:-translate-y-0.5'}`}>

      {/* Checkbox */}
      <button
        id={`toggle-${task._id}`}
        onClick={() => onToggle(task._id, !task.completed)}
        aria-label="Toggle task"
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${task.completed
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 border-transparent shadow-sm shadow-violet-200'
                      : 'border-gray-300 hover:border-violet-400 bg-white'}`}
      >
        {task.completed && <Check size={12} strokeWidth={3} className="text-white" />}
      </button>

      {/* Title */}
      <span className={`flex-1 text-sm font-medium transition-all duration-200
                        ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {task.title}
      </span>

      {/* Completed tag */}
      {task.completed && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full hidden sm:inline-flex">
          Done
        </span>
      )}

      {/* Delete */}
      <button
        id={`delete-${task._id}`}
        onClick={() => onDelete(task._id)}
        aria-label="Delete task"
        className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
