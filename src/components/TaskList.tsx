import React from 'react';
import type { AsyncStatus, Task } from '../types/task';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
  tasks: Task[];
  totalOnPage: number;
  status: AsyncStatus;
  error: string | null;
  onRetry: () => void;
  onToggle: (id: number) => void;
  onSelectDetails: (task: Task) => void;
  onEdit: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalOnPage,
  status,
  error,
  onRetry,
  onToggle,
  onSelectDetails,
  onEdit,
  onRequestDelete,
}) => {
  if (status === 'loading') {
    return (
      <div className="task-list__state" aria-busy="true">
        <div className="task-list__spinner" aria-hidden="true" />
        <h3 className="task-list__state-title">Завантаження завдань...</h3>
        <p className="task-list__state-subtitle">
          Отримуємо актуальний список із REST API.
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="task-list__state task-list__state--error" role="alert">
        <div
          className="task-list__state-icon task-list__state-icon--error"
          aria-hidden="true"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="task-list__state-title">Помилка завантаження</h3>
        <p className="task-list__state-subtitle">
          {error ?? 'Не вдалося отримати дані від сервера.'}
        </p>
        <button
          type="button"
          className="task-list__retry-btn"
          onClick={onRetry}
        >
          Спробувати ще
        </button>
      </div>
    );
  }

  if (totalOnPage === 0) {
    return (
      <div className="task-list__state">
        <div className="task-list__state-icon" aria-hidden="true">
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h3 className="task-list__state-title">Завдань не знайдено</h3>
        <p className="task-list__state-subtitle">
          На цій сторінці немає завдань. Спробуйте додати нове або перейдіть на
          іншу сторінку.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__state">
        <div className="task-list__state-icon" aria-hidden="true">
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h3 className="task-list__state-title">За цим фільтром завдань немає</h3>
        <p className="task-list__state-subtitle">
          Спробуйте змінити фільтр або перейти на іншу сторінку.
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list" aria-label="Список навчальних завдань">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onSelectDetails={onSelectDetails}
          onEdit={onEdit}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </ul>
  );
};
