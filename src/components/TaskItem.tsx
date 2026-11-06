import React from 'react';
import type { Priority, Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const PRIORITY_LABELS: Record<Priority, { label: string; modifier: string }> = {
  high: { label: 'Високий', modifier: 'task-item__priority--high' },
  medium: { label: 'Середній', modifier: 'task-item__priority--medium' },
  low: { label: 'Низький', modifier: 'task-item__priority--low' },
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  const priorityInfo = PRIORITY_LABELS[task.priority];

  return (
    <li
      className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
      data-testid={`task-item-${task.id}`}
    >
      <div className="task-item__status">
        <label className="task-item__checkbox-wrapper" htmlFor={`task-checkbox-${task.id}`}>
          <input
            id={`task-checkbox-${task.id}`}
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={`Позначити "${task.title}" як ${task.completed ? 'невиконане' : 'виконане'}`}
          />
        </label>
      </div>

      <div className="task-item__content">
        <div className="task-item__header">
          <label
            htmlFor={`task-checkbox-${task.id}`}
            className="task-item__title"
          >
            {task.title}
          </label>
          <div className="task-item__badges">
            <span className={`task-item__priority ${priorityInfo.modifier}`}>
              {priorityInfo.label}
            </span>
            <span className="task-item__category">
              {task.category}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__delete-btn"
          title={`Видалити "${task.title}"`}
          onClick={() => onDelete(task.id)}
          aria-label={`Видалити завдання ${task.title}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </li>
  );
};
