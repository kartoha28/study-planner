import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { TaskStats } from '../components/TaskStats';
import { Toast } from '../components/Toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTasks } from '../hooks/useTasks';
import type {
  FilterStatus,
  Priority,
  SortOrder,
  Task,
  ToastMessage,
  ToastType,
} from '../types/task';

const PAGE_SIZE = 10;

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const TasksPage: React.FC = () => {
  // Client/UI state (локальне збереження лише для UI-налаштувань, НЕ для server state)
  const [filter, setFilter] = useLocalStorage<FilterStatus>(
    'study-planner-filter',
    'all',
  );
  const [sortOrder, setSortOrder] = useLocalStorage<SortOrder>(
    'study-planner-sort',
    'default',
  );
  const [page, setPage] = useState(1);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDetailsTask, setSelectedDetailsTask] = useState<Task | null>(
    null,
  );
  const [deleteCandidate, setDeleteCandidate] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string, type: ToastType = 'info') => {
    setToast({
      id: Date.now(),
      text,
      type,
      durationMs: 3000,
    });
  }, []);

  // Автоприховування Toast через 3 секунди
  useEffect(() => {
    if (!toast) {
      return;
    }
    const timerId = window.setTimeout(() => {
      setToast(null);
    }, toast.durationMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [toast]);

  // Server state: завдання та пагінація з REST API
  const {
    tasks,
    total,
    status,
    error,
    retry,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks({
    page,
    pageSize: PAGE_SIZE,
    onNotify: showToast,
  });

  // Derived state для поточної сторінки
  const totalOnPage = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const uncompletedCount = totalOnPage - completedCount;

  useEffect(() => {
    document.title = `Study Planner — ${uncompletedCount} active tasks`;
  }, [uncompletedCount]);

  const displayedTasks = useMemo(() => {
    let result = tasks;

    if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    } else if (filter === 'uncompleted') {
      result = result.filter((t) => !t.completed);
    }

    if (sortOrder === 'priority-desc') {
      result = [...result].sort(
        (a, b) => PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority],
      );
    } else if (sortOrder === 'priority-asc') {
      result = [...result].sort(
        (a, b) => PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority],
      );
    }

    return result;
  }, [tasks, filter, sortOrder]);

  const handleUpdateTask = useCallback(
    async (id: number, dto: Parameters<typeof updateTask>[1]) => {
      await updateTask(id, dto);
      setEditingTask(null);
    },
    [updateTask],
  );

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTask(deleteCandidate.id);
      if (editingTask?.id === deleteCandidate.id) {
        setEditingTask(null);
      }
      if (selectedDetailsTask?.id === deleteCandidate.id) {
        setSelectedDetailsTask(null);
      }
      setDeleteCandidate(null);
    } catch {
      // Помилка вже показана через Toast у useTasks
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="study-planner">
      <Header isLoading={status === 'loading'} onRefresh={retry} />

      <main className="study-planner__main">
        <div className="study-planner__container">
          <TaskStats
            total={totalOnPage}
            completed={completedCount}
            uncompleted={uncompletedCount}
          />

          <TaskForm
            key={editingTask ? `edit-${editingTask.id}` : 'create'}
            editingTask={editingTask}
            onAddTask={createTask}
            onUpdateTask={handleUpdateTask}
            onCancelEdit={() => setEditingTask(null)}
          />

          <section className="study-planner__list-section">
            <div className="study-planner__list-header">
              <h2 className="study-planner__list-title">Список завдань</h2>
              <span className="study-planner__list-count">
                На сторінці: {displayedTasks.length} з {totalOnPage}
              </span>
            </div>

            <TaskFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              totalCount={totalOnPage}
              completedCount={completedCount}
              uncompletedCount={uncompletedCount}
              currentSort={sortOrder}
              onSortChange={setSortOrder}
            />

            <TaskList
              tasks={displayedTasks}
              totalOnPage={totalOnPage}
              status={status}
              error={error}
              onRetry={retry}
              onToggle={toggleTask}
              onSelectDetails={setSelectedDetailsTask}
              onEdit={setEditingTask}
              onRequestDelete={setDeleteCandidate}
            />

            <Pagination
              currentPage={page}
              totalItems={total}
              pageSize={PAGE_SIZE}
              isLoading={status === 'loading'}
              onPageChange={setPage}
            />
          </section>
        </div>
      </main>

      <footer className="footer">
        <p className="footer__text">Study Planner • Владислав Іванів</p>
      </footer>

      {selectedDetailsTask && (
        <TaskDetailsModal
          taskId={selectedDetailsTask.id}
          fallbackTask={selectedDetailsTask}
          onClose={() => setSelectedDetailsTask(null)}
        />
      )}

      {deleteCandidate && (
        <ConfirmDialog
          title="Підтвердження видалення"
          message={`Ви справді хочете видалити завдання «${deleteCandidate.title}»?`}
          isSubmitting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteCandidate(null)}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
