import React from 'react';
import type { Priority, Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onSelectDetails: (task: Task) => void;
  onEdit: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
}

const PRIORITY_LABELS: Record<Priority, { label: string; modifier: string }> = {
  high: { label: 'Високий', modifier: 'task-item__priority--high' },
  medium: { label: 'Середній', modifier: 'task-item__priority--medium' },
  low: { label: 'Низький', modifier: 'task-item__priority--low' },
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onSelectDetails,
  onEdit,
  onRequestDelete,
}) => {
  const priorityInfo = PRIORITY_LABELS[task.priority];

  return (
    <li
      className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
      data-testid={`task-item-${task.id}`}
    >
      <div className="task-item__status">
        <label
          className="task-item__checkbox-wrapper"
          htmlFor={`task-checkbox-${task.id}`}
        >
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
          <button
            type="button"
            className="task-item__title-btn"
            onClick={() => onSelectDetails(task)}
          >
            {task.title}
          </button>
          <div className="task-item__badges">
            <span className={`task-item__priority ${priorityInfo.modifier}`}>
              {priorityInfo.label}
            </span>
            <span className="task-item__category">{task.category}</span>
          </div>
        </div>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__action-btn task-item__action-btn--details"
          title="Деталі завдання (GET за id)"
          onClick={() => onSelectDetails(task)}
          aria-label={`Переглянути деталі ${task.title}`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        <button
          type="button"
          className="task-item__action-btn task-item__action-btn--edit"
          title={`Редагувати "${task.title}"`}
          onClick={() => onEdit(task)}
          aria-label={`Редагувати завдання ${task.title}`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button
          type="button"
          className="task-item__action-btn task-item__action-btn--delete"
          title={`Видалити "${task.title}"`}
          onClick={() => onRequestDelete(task)}
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
