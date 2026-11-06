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
        <input
          id={`task-checkbox-${task.id}`}
          type="checkbox"
          className="task-item__checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Позначити завдання "${task.title}" як ${task.completed ? 'невиконане' : 'виконане'}`}
        />
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
              📁 {task.category}
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
          title={`Видалити завдання "${task.title}"`}
          onClick={() => onDelete(task.id)}
        >
          🗑️
        </button>
      </div>
    </li>
  );
};
