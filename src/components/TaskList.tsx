import React from 'react';
import { TaskItem } from './TaskItem';
import type { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTasksCount,
  onToggle,
  onDelete,
}) => {
  // Умовний рендеринг: випадок 1 — коли взагалі немає жодного завдання
  if (totalTasksCount === 0) {
    return (
      <div className="task-list__empty">
        <div className="task-list__empty-icon">📝</div>
        <h3 className="task-list__empty-title">Завдань поки немає</h3>
        <p className="task-list__empty-subtitle">
          Додайте перше навчальне завдання за допомогою форми вище.
        </p>
      </div>
    );
  }

  // Умовний рендеринг: випадок 2 — коли завдання є, але за поточним фільтром нічого немає
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <div className="task-list__empty-icon">🔍</div>
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
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
