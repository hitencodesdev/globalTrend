import React, { useState } from 'react';
import { Check, Pencil, Trash2, X, Save } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(task.title);

  const save = () => {
    if (draft.trim() && draft.trim() !== task.title) onEdit(task._id, draft.trim());
    setEditing(false);
  };

  const cancel = () => { setDraft(task.title); setEditing(false); };

  const handleKey = (e) => {
    if (e.key === 'Enter')  save();
    if (e.key === 'Escape') cancel();
  };

  const date = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      className={`group flex items-center gap-4 px-5 py-4 rounded-2xl border
                  transition-all duration-200 animate-slide-up
                  ${task.completed
                    ? 'bg-slate-50 border-slate-100 opacity-60'
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-card-hover shadow-card'
                  }`}
    >
      {/* ─── Checkbox ─── */}
      <button
        id={`toggle-${task._id}`}
        onClick={() => onToggle(task._id, !task.completed)}
        aria-label="Toggle complete"
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200
                    ${task.completed
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-slate-300 hover:border-indigo-500 bg-white'
                    }`}
      >
        {task.completed && <Check size={11} strokeWidth={3} className="text-white" />}
      </button>

      {/* ─── Title / Edit ─── */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            className="w-full h-8 px-3 text-sm font-medium text-slate-700 bg-slate-50
                       border border-indigo-300 rounded-lg focus:outline-none focus:ring-2
                       focus:ring-indigo-400/30 transition-all duration-150"
          />
        ) : (
          <p className={`text-sm font-medium truncate transition-all duration-200
                         ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
            {task.title}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-0.5">Added {date}</p>
      </div>

      {/* ─── Status Badge ─── */}
      {!editing && (
        <span className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
                          ${task.completed
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-indigo-50 text-indigo-600'
                          }`}>
          {task.completed ? '✓ Done' : '● Active'}
        </span>
      )}

      {/* ─── Actions ─── */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {editing ? (
          <>
            <button
              id={`save-${task._id}`}
              onClick={save}
              aria-label="Save"
              className="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 transition-colors duration-150"
            >
              <Save size={15} />
            </button>
            <button
              onClick={cancel}
              aria-label="Cancel"
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors duration-150"
            >
              <X size={15} />
            </button>
          </>
        ) : (
          <>
            {!task.completed && (
              <button
                id={`edit-${task._id}`}
                onClick={() => setEditing(true)}
                aria-label="Edit task"
                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
              >
                <Pencil size={15} />
              </button>
            )}
            <button
              id={`delete-${task._id}`}
              onClick={() => onDelete(task._id)}
              aria-label="Delete task"
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
