import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority, Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
}

const PRIORITY_LABELS: Record<Priority, { label: string; modifier: string }> = {
  high: { label: 'Високий', modifier: 'task-item__priority--high' },
  medium: { label: 'Середній', modifier: 'task-item__priority--medium' },
  low: { label: 'Низький', modifier: 'task-item__priority--low' },
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, requestDelete, startEditTask, pendingDeletion } =
    useTaskContext();

  const priorityInfo = PRIORITY_LABELS[task.priority];
  const isPendingDelete = pendingDeletion?.ids.includes(task.id) ?? false;

  return (
    <li
      className={`task-item ${task.completed ? 'task-item--completed' : ''} ${
        isPendingDelete ? 'task-item--pending-delete' : ''
      }`}
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
            disabled={isPendingDelete}
            onChange={() => toggleTask(task.id)}
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
            <span className="task-item__category">{task.category}</span>
            {isPendingDelete && (
              <span className="task-item__pending-badge">Буде видалено</span>
            )}
          </div>
        </div>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__action-btn task-item__action-btn--edit"
          title={`Редагувати "${task.title}"`}
          disabled={isPendingDelete}
          onClick={() => startEditTask(task)}
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
          disabled={isPendingDelete}
          onClick={() => requestDelete(task.id)}
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
