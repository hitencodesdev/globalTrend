import React from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`flex items-center justify-between p-4 mb-3 rounded-xl border transition-all duration-300 ${task.completed ? 'bg-gray-50 border-gray-200 shadow-sm' : 'bg-white border-blue-100 shadow-md hover:shadow-lg'}`}>
      <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onToggle(task._id, !task.completed)}>
        <button
          className={`flex-shrink-0 transition-colors duration-200 ${task.completed ? 'text-green-500 hover:text-green-600' : 'text-gray-300 hover:text-blue-500'}`}
        >
          {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
        </button>
        <span className={`text-lg transition-all duration-300 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
          {task.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(task._id)}
        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
        aria-label="Delete Task"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default TaskItem;
