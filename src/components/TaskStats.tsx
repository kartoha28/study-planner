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
    <section className="task-stats" aria-label="Статистика навчальних завдань">
      <div className="task-stats__card task-stats__card--total">
        <span className="task-stats__icon">📋</span>
        <div className="task-stats__info">
          <span className="task-stats__number">{total}</span>
          <span className="task-stats__label">Всього завдань</span>
        </div>
      </div>

      <div className="task-stats__card task-stats__card--completed">
        <span className="task-stats__icon">✅</span>
        <div className="task-stats__info">
          <span className="task-stats__number">{completed}</span>
          <span className="task-stats__label">Виконано ({completionPercentage}%)</span>
        </div>
      </div>

      <div className="task-stats__card task-stats__card--uncompleted">
        <span className="task-stats__icon">⏳</span>
        <div className="task-stats__info">
          <span className="task-stats__number">{uncompleted}</span>
          <span className="task-stats__label">До виконання</span>
        </div>
      </div>
    </section>
  );
};
