import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './Toast.scss';

export const Toast: React.FC = () => {
  const { toast, undoDelete, dismissToast } = useTaskContext();

  if (!toast) {
    return null;
  }

  return (
    <div
      className={`toast toast--${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast__body">
        <span className="toast__message">{toast.text}</span>
        <div className="toast__actions">
          {toast.hasUndo && (
            <button
              type="button"
              className="toast__undo-btn"
              onClick={undoDelete}
            >
              Скасувати
            </button>
          )}
          <button
            type="button"
            className="toast__close-btn"
            aria-label="Закрити сповіщення"
            onClick={dismissToast}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {toast.hasUndo && (
        <div className="toast__progress">
          <div
            key={toast.id}
            className="toast__progress-bar"
            style={{ animationDuration: `${toast.durationMs}ms` }}
          />
        </div>
      )}
    </div>
  );
};
