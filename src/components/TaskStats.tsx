import React from 'react';

interface TaskStatsProps {
  total: number;
  completed: number;
  uncompleted: number;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  total,
  completed,
  uncompleted,
}) => {
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="task-stats" aria-label="Статистика завдань">
      <div className="task-stats__card task-stats__card--total">
        <div className="task-stats__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </div>
        <div className="task-stats__info">
          <span className="task-stats__number">{total}</span>
          <span className="task-stats__label">Всього завдань</span>
        </div>
      </div>

      <div className="task-stats__card task-stats__card--completed">
        <div className="task-stats__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="task-stats__info">
          <span className="task-stats__number">{completed}</span>
          <span className="task-stats__label">Виконано ({completionPercentage}%)</span>
        </div>
      </div>

      <div className="task-stats__card task-stats__card--uncompleted">
        <div className="task-stats__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="task-stats__info">
          <span className="task-stats__number">{uncompleted}</span>
          <span className="task-stats__label">До виконання</span>
        </div>
      </div>
    </section>
  );
};
