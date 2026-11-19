import React from 'react';
import type { FilterStatus, SortOrder } from '../types/task';
import './TaskFilters.scss';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  totalCount: number;
  completedCount: number;
  uncompletedCount: number;
  currentSort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  totalCount,
  completedCount,
  uncompletedCount,
  currentSort,
  onSortChange,
}) => {
  return (
    <section
      className="task-filters"
      aria-label="Фільтрація та сортування завдань"
    >
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
          Не виконані{' '}
          <span className="task-filters__badge">{uncompletedCount}</span>
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
      </div>
    </section>
  );
};
