import React, { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority } from '../types/task';
import './TaskForm.scss';

const CATEGORY_SUGGESTIONS = [
  'React',
  'TypeScript',
  'Веб-системи',
  'Архітектура ПЗ',
  "Комп'ютерна графіка",
  'Англійська',
  'Styling',
  'Інше',
];

export const TaskForm: React.FC = () => {
  const { editingTask, addTask, updateTask, cancelEditTask } = useTaskContext();

  const isEditMode = editingTask !== null;
  const [isExpanded, setIsExpanded] = useState(isEditMode);
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(
    editingTask?.description ?? '',
  );
  const [category, setCategory] = useState(editingTask?.category ?? 'React');
  const [priority, setPriority] = useState<Priority>(
    editingTask?.priority ?? 'medium',
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Назва завдання є обов'язковою та не може бути порожньою");
      return;
    }

    const dto = {
      title: trimmedTitle,
      description: description.trim(),
      category: category.trim() || 'Загальне',
      priority,
    };

    if (editingTask) {
      updateTask(editingTask.id, dto);
      return;
    }

    addTask(dto);

    // Очищення форми після створення
    setTitle('');
    setDescription('');
    setCategory('React');
    setPriority('medium');
    setError(null);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setError(null);
    if (isEditMode) {
      cancelEditTask();
      return;
    }
    setIsExpanded(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error && e.target.value.trim()) {
      setError(null);
    }
  };

  if (!isExpanded) {
    return (
      <div className="task-form-trigger-wrapper">
        <button
          type="button"
          className="task-form-trigger"
          onClick={() => setIsExpanded(true)}
        >
          <svg
            className="task-form-trigger__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="task-form-trigger__text">
            Створити нове завдання
          </span>
        </button>
      </div>
    );
  }

  return (
    <section
      className="task-form-wrapper"
      aria-label={
        isEditMode ? 'Секція редагування завдання' : 'Секція додавання завдання'
      }
    >
      <form
        className={`task-form ${isEditMode ? 'task-form--editing' : ''}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="task-form__header">
          <h2 className="task-form__heading">
            {isEditMode ? 'Редагувати завдання' : 'Нове завдання'}
          </h2>
          <button
            type="button"
            className="task-form__close-btn"
            title="Закрити форму"
            onClick={handleCancel}
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

        <div className="task-form__grid">
          <div className="task-form__field task-form__field--title">
            <label className="task-form__label" htmlFor="task-title">
              Назва завдання <span className="task-form__required">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`task-form__input ${error ? 'task-form__input--invalid' : ''}`}
              placeholder="Наприклад: Підготувати звіт до лабораторної №9"
              value={title}
              autoFocus
              onChange={handleTitleChange}
            />
            {error && <span className="task-form__error">{error}</span>}
          </div>

          <div className="task-form__field">
            <label className="task-form__label" htmlFor="task-category">
              Категорія / Предмет
            </label>
            <input
              id="task-category"
              type="text"
              list="categories-list"
              className="task-form__input"
              placeholder="Категорія"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="categories-list">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="task-form__field">
            <label className="task-form__label" htmlFor="task-priority">
              Пріоритет
            </label>
            <select
              id="task-priority"
              className="task-form__select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>
          </div>

          <div className="task-form__field task-form__field--full">
            <label className="task-form__label" htmlFor="task-description">
              Короткий опис / Нотатки
            </label>
            <textarea
              id="task-description"
              className="task-form__textarea"
              rows={2}
              placeholder="Деталі, дедлайн, посилання на матеріали..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="task-form__actions">
          <button
            type="button"
            className="task-form__cancel-btn"
            onClick={handleCancel}
          >
            Скасувати
          </button>
          <button type="submit" className="task-form__submit-btn">
            {isEditMode ? 'Зберегти зміни' : 'Створити завдання'}
          </button>
        </div>
      </form>
    </section>
  );
};
