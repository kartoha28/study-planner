import React, { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { TaskStats } from './components/TaskStats';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { initialTasks } from './data/initialTasks';
import type { FilterStatus, NewTaskDto, Priority, SortOrder, Task } from './types/task';
import './styles/main.scss';

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const App: React.FC = () => {
  // Головний стан списку завдань (піднятий у батьківський компонент)
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Стан поточного фільтра
  const [filter, setFilter] = useState<FilterStatus>('all');

  // Стан сортування за пріоритетом (додаткова функція)
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  // Обчислювані значення статистики (без окремого state!)
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const uncompletedCount = totalCount - completedCount;

  // Обчислення відфільтрованого та відсортованого списку
  const displayedTasks = useMemo(() => {
    let result = tasks;

    // 1. Фільтрація
    if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    } else if (filter === 'uncompleted') {
      result = result.filter((t) => !t.completed);
    }

    // 2. Сортування за пріоритетом (якщо обрано)
    if (sortOrder === 'priority-desc') {
      result = [...result].sort((a, b) => PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority]);
    } else if (sortOrder === 'priority-asc') {
      result = [...result].sort((a, b) => PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority]);
    }

    return result;
  }, [tasks, filter, sortOrder]);

  // Callback: додавання нового завдання (Immutable update)
  const handleAddTask = (dto: NewTaskDto) => {
    const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newTask: Task = {
      id: nextId,
      ...dto,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Callback: перемикання стану виконання (Immutable update)
  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Callback: видалення завдання (Immutable update)
  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Callback: очистити всі виконані
  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  return (
    <div className="study-planner">
      <Header />

      <main className="study-planner__main">
        <div className="study-planner__container">
          <TaskStats
            total={totalCount}
            completed={completedCount}
            uncompleted={uncompletedCount}
          />

          <TaskForm onAddTask={handleAddTask} />

          <section className="study-planner__list-section">
            <div className="study-planner__list-header">
              <h2 className="study-planner__list-title">Список завдань</h2>
              <span className="study-planner__list-count">
                Відображається: {displayedTasks.length} з {totalCount}
              </span>
            </div>

            <TaskFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              totalCount={totalCount}
              completedCount={completedCount}
              uncompletedCount={uncompletedCount}
              currentSort={sortOrder}
              onSortChange={setSortOrder}
              onClearCompleted={handleClearCompleted}
            />

            <TaskList
              tasks={displayedTasks}
              totalTasksCount={totalCount}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          </section>
        </div>
      </main>

      <footer className="footer">
        <p className="footer__text">
          Study Planner • Владислав Іванів
        </p>
      </footer>
    </div>
  );
};

export default App;
