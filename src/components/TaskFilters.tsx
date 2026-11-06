import React from 'react';
import type { FilterStatus, SortOrder } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  totalCount: number;
  completedCount: number;
  uncompletedCount: number;
  currentSort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  onClearCompleted: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  totalCount,
  completedCount,
  uncompletedCount,
  currentSort,
  onSortChange,
  onClearCompleted,
}) => {
  return (
    <section className="task-filters" aria-label="Фільтрація та сортування завдань">
      <div className="task-filters__group">
        <button
          type="button"
          className={`task-filters__btn ${currentFilter === 'all' ? 'task-filters__btn--active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Всі <span className="task-filters__badge">{totalCount}</span>
        </button>

        <button
          type="button"
          className={`task-filters__btn ${currentFilter === 'uncompleted' ? 'task-filters__btn--active' : ''}`}
          onClick={() => onFilterChange('uncompleted')}
        >
          Не виконані <span className="task-filters__badge">{uncompletedCount}</span>
        </button>

        <button
          type="button"
          className={`task-filters__btn ${currentFilter === 'completed' ? 'task-filters__btn--active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Виконані <span className="task-filters__badge">{completedCount}</span>
        </button>
      </div>

      <div className="task-filters__controls">
        <div className="task-filters__sort-wrapper">
          <label className="task-filters__sort-label" htmlFor="priority-sort">
            Сортування:
          </label>
          <select
            id="priority-sort"
            className="task-filters__sort-select"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
          >
            <option value="default">За замовчуванням</option>
            <option value="priority-desc">Пріоритет: Високий → Низький</option>
            <option value="priority-asc">Пріоритет: Низький → Високий</option>
          </select>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            className="task-filters__clear-btn"
            title="Видалити всі виконані завдання"
            onClick={onClearCompleted}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Очистити виконані</span>
          </button>
        )}
      </div>
    </section>
  );
};
