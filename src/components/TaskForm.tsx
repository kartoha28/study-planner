import React, { useState } from 'react';
import type { NewTaskDto, Priority } from '../types/task';

interface TaskFormProps {
  onAddTask: (taskDto: NewTaskDto) => void;
}

const CATEGORY_SUGGESTIONS = [
  'React',
  'TypeScript',
  'Веб-системи',
  'Архітектура ПЗ',
  'Комп\'ютерна графіка',
  'Англійська',
  'Інше',
];

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('React');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Назва завдання є обов\'язковою та не може бути порожньою!');
      return;
    }

    onAddTask({
      title: trimmedTitle,
      description: description.trim(),
      category: category.trim() || 'Загальне',
      priority,
    });

    // Очищення форми після успішного додавання
    setTitle('');
    setDescription('');
    setCategory('React');
    setPriority('medium');
    setError(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error && e.target.value.trim()) {
      setError(null);
    }
  };

  return (
    <section className="task-form-wrapper" aria-label="Секція додавання завдання">
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <h2 className="task-form__heading">✨ Додати нове навчальне завдання</h2>

        <div className="task-form__grid">
          {/* Поле: Назва (обов'язкове) */}
          <div className="task-form__field task-form__field--title">
            <label className="task-form__label" htmlFor="task-title">
              Назва завдання <span className="task-form__required">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`task-form__input ${error ? 'task-form__input--invalid' : ''}`}
              placeholder="Наприклад: Підготувати звіт до лабораторної №8"
              value={title}
              onChange={handleTitleChange}
            />
            {error && <span className="task-form__error">{error}</span>}
          </div>

          {/* Поле: Категорія */}
          <div className="task-form__field">
            <label className="task-form__label" htmlFor="task-category">
              Категорія / Предмет
            </label>
            <input
              id="task-category"
              type="text"
              list="categories-list"
              className="task-form__input"
              placeholder="Оберіть або введіть категорію"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="categories-list">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          {/* Поле: Пріоритет */}
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
              <option value="low">🟢 Низький (Low)</option>
              <option value="medium">🟡 Середній (Medium)</option>
              <option value="high">🔴 Високий (High)</option>
            </select>
          </div>

          {/* Поле: Опис */}
          <div className="task-form__field task-form__field--full">
            <label className="task-form__label" htmlFor="task-description">
              Короткий опис / Нотатки
            </label>
            <textarea
              id="task-description"
              className="task-form__textarea"
              rows={2}
              placeholder="Деталі завдання, дедлайн, посилання на матеріали..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="task-form__actions">
          <button type="submit" className="task-form__submit-btn">
            ➕ Додати завдання
          </button>
        </div>
      </form>
    </section>
  );
};
