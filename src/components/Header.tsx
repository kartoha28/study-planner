import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './Header.scss';

export const Header: React.FC = () => {
  const { resetTasks } = useTaskContext();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <div className="header__logo">
            <svg
              className="header__logo-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="12" y2="17" />
              <line x1="6" y1="4" x2="6" y2="22" />
            </svg>
          </div>
          <h1 className="header__title">Study Planner</h1>
        </div>

        <button
          type="button"
          className="header__reset-btn"
          title="Повернути початковий список завдань"
          onClick={resetTasks}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Скинути дані</span>
        </button>
      </div>
    </header>
  );
};
