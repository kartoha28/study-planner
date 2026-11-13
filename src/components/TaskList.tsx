import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

export const TaskList: React.FC = () => {
  const { displayedTasks: tasks, totalCount: totalTasksCount } =
    useTaskContext();

  // Умовний рендеринг: випадок 1 — коли взагалі немає жодного завдання
  if (totalTasksCount === 0) {
    return (
      <div className="task-list__empty">
        <div className="task-list__empty-icon" aria-hidden="true">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="task-list__empty-title">Завдань поки немає</h3>
        <p className="task-list__empty-subtitle">
          Натисніть кнопку вище, щоб додати своє перше навчальне завдання.
        </p>
      </div>
    );
  }

  // Умовний рендеринг: випадок 2 — коли завдання є, але за поточним фільтром нічого немає
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <div className="task-list__empty-icon" aria-hidden="true">
          <svg
            width="40"
            height="40"
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
        <h3 className="task-list__empty-title">За цим фільтром завдань немає</h3>
        <p className="task-list__empty-subtitle">
          Спробуйте перемкнути фільтр або додати нове завдання відповідного типу.
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list" aria-label="Список навчальних завдань">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
};
