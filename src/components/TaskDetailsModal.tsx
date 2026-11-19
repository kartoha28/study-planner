import React, { useEffect, useState } from 'react';
import { isAbortError, normalizeHttpError } from '../api/httpClient';
import { taskRepository } from '../repositories/taskRepository';
import type { AsyncStatus, Priority, Task } from '../types/task';
import './TaskDetailsModal.scss';

interface TaskDetailsModalProps {
  taskId: number;
  fallbackTask?: Task;
  onClose: () => void;
}

const PRIORITY_TEXT: Record<Priority, string> = {
  high: 'Високий',
  medium: 'Середній',
  low: 'Низький',
};

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  taskId,
  fallbackTask,
  onClose,
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const loadDetails = async () => {
      setStatus('loading');
      setError(null);

      try {
        const fetched = await taskRepository.getById(taskId, controller.signal);
        if (!isCancelled) {
          // Зберігаємо client-only metadata (description, priority, category), якщо завдання вже має їх на клієнті
          setTask({
            ...fetched,
            description: fallbackTask?.description || fetched.description,
            priority: fallbackTask?.priority ?? fetched.priority,
            category: fallbackTask?.category ?? fetched.category,
          });
          setStatus('success');
        }
      } catch (err) {
        if (isCancelled || isAbortError(err)) {
          return;
        }
        setError(normalizeHttpError(err).message);
        setStatus('error');
      }
    };

    void loadDetails();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [taskId, reloadTick, fallbackTask]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-heading"
      onClick={onClose}
    >
      <div className="task-details" onClick={(e) => e.stopPropagation()}>
        <div className="task-details__header">
          <h2 id="task-details-heading" className="task-details__heading">
            Деталі завдання #{taskId}
          </h2>
          <button
            type="button"
            className="task-details__close-btn"
            aria-label="Закрити деталі"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="task-details__body">
          {status === 'loading' && (
            <div className="task-details__state">
              <span>Завантаження деталей завдання з API...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="task-details__state task-details__state--error">
              <span>{error ?? 'Не вдалося завантажити деталі завдання'}</span>
              <button
                type="button"
                className="task-details__retry-btn"
                onClick={() => setReloadTick((prev) => prev + 1)}
              >
                Спробувати ще
              </button>
            </div>
          )}

          {status === 'success' && task && (
            <>
              <h3 className="task-details__title">{task.title}</h3>

              <div className="task-details__meta">
                <div className="task-details__meta-item">
                  <span className="task-details__meta-label">Статус</span>
                  <span
                    className={`task-details__meta-value ${
                      task.completed
                        ? 'task-details__meta-value--done'
                        : 'task-details__meta-value--active'
                    }`}
                  >
                    {task.completed ? 'Виконано' : 'У процесі'}
                  </span>
                </div>

                <div className="task-details__meta-item">
                  <span className="task-details__meta-label">Пріоритет</span>
                  <span className="task-details__meta-value">
                    {PRIORITY_TEXT[task.priority]}
                  </span>
                </div>

                <div className="task-details__meta-item">
                  <span className="task-details__meta-label">Категорія</span>
                  <span className="task-details__meta-value">
                    {task.category}
                  </span>
                </div>

                <div className="task-details__meta-item">
                  <span className="task-details__meta-label">ID в API</span>
                  <span className="task-details__meta-value">#{task.id}</span>
                </div>
              </div>

              <div className="task-details__description-block">
                <span className="task-details__meta-label">Опис / Нотатки</span>
                <p className="task-details__description-text">
                  {task.description || 'Опис не вказано (API не містить опису)'}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="task-details__footer">
          <button
            type="button"
            className="task-details__ok-btn"
            onClick={onClose}
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
