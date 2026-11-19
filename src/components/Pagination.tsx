import React from 'react';
import './Pagination.scss';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  isLoading,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Пагінація завдань">
      <span className="pagination__info">
        Сторінка <strong>{currentPage}</strong> з{' '}
        <strong>{totalPages}</strong> (Всього в API: {totalItems})
      </span>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ← Попередня
        </button>

        <button
          type="button"
          className="pagination__btn"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Наступна →
        </button>
      </div>
    </nav>
  );
};
