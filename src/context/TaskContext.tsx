import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { initialTasks } from '../data/initialTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { taskReducer, type TaskState } from '../reducers/taskReducer';
import type {
  FilterStatus,
  NewTaskDto,
  PendingDeletion,
  Priority,
  SortOrder,
  Task,
  ToastMessage,
  ToastType,
} from '../types/task';

const TASKS_STORAGE_KEY = 'study-planner-tasks';
const FILTER_STORAGE_KEY = 'study-planner-filter';
const SORT_STORAGE_KEY = 'study-planner-sort';
const UNDO_TIMEOUT_MS = 5000;
const DEFAULT_TOAST_MS = 3000;

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function loadInitialTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw === null) {
      return initialTasks;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Task[]) : initialTasks;
  } catch {
    return initialTasks;
  }
}

export interface TaskContextValue {
  tasks: Task[];
  displayedTasks: Task[];
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  sortOrder: SortOrder;
  setSortOrder: (sort: SortOrder) => void;
  totalCount: number;
  completedCount: number;
  uncompletedCount: number;
  pendingDeletion: PendingDeletion | null;
  editingTask: Task | null;
  toast: ToastMessage | null;
  addTask: (dto: NewTaskDto) => void;
  updateTask: (id: number, dto: NewTaskDto) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: () => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  startEditTask: (task: Task) => void;
  cancelEditTask: () => void;
  dismissToast: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext<TaskContextValue | null>(null);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    taskReducer,
    undefined,
    (): TaskState => ({
      tasks: loadInitialTasks(),
      pendingDeletion: null,
    }),
  );

  const [filter, setFilter] = useLocalStorage<FilterStatus>(
    FILTER_STORAGE_KEY,
    'all',
  );
  const [sortOrder, setSortOrder] = useLocalStorage<SortOrder>(
    SORT_STORAGE_KEY,
    'default',
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (
      text: string,
      type: ToastType = 'info',
      durationMs = DEFAULT_TOAST_MS,
      hasUndo = false,
    ) => {
      setToast({
        id: Date.now(),
        text,
        type,
        durationMs,
        hasUndo,
      });
    },
    [],
  );

  // Derived state: статистика завдань
  const totalCount = state.tasks.length;
  const completedCount = state.tasks.filter((t) => t.completed).length;
  const uncompletedCount = totalCount - completedCount;

  // Derived state: фільтрація та сортування
  const displayedTasks = useMemo(() => {
    let result = state.tasks;

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
  }, [state.tasks, filter, sortOrder]);

  // Effect 1: Синхронізація tasks у localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(state.tasks),
      );
    } catch {
      // Ігноруємо помилки запису в localStorage
    }
  }, [state.tasks]);

  // Effect 2: Синхронізація між відкритими вкладками через storage event
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === TASKS_STORAGE_KEY && event.newValue !== null) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'syncFromStorage', payload: parsed as Task[] });
          }
        } catch {
          // Ігноруємо пошкоджені зовнішні дані
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Effect 3: Синхронізація заголовка вкладки браузера
  useEffect(() => {
    document.title = `Study Planner — ${uncompletedCount} active tasks`;
  }, [uncompletedCount]);

  // Effect 4: Таймер для Undoable Delete (5 секунд) із очищенням
  useEffect(() => {
    if (!state.pendingDeletion) {
      return;
    }

    const timerId = window.setTimeout(() => {
      dispatch({ type: 'confirmDelete' });
      showToast('Видалення остаточно виконано', 'success', DEFAULT_TOAST_MS);
    }, UNDO_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [state.pendingDeletion, showToast]);

  // Effect 5: Автоматичне приховування звичайних Toast-повідомлень
  useEffect(() => {
    if (!toast || toast.hasUndo) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setToast(null);
    }, toast.durationMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [toast]);

  const addTask = useCallback(
    (dto: NewTaskDto) => {
      dispatch({ type: 'add', payload: dto });
      showToast(`Створено завдання «${dto.title}»`, 'success');
    },
    [showToast],
  );

  const updateTask = useCallback(
    (id: number, dto: NewTaskDto) => {
      dispatch({ type: 'update', payload: { id, data: dto } });
      setEditingTask(null);
      showToast(`Завдання «${dto.title}» оновлено`, 'success');
    },
    [showToast],
  );

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: id });
  }, []);

  const requestDelete = useCallback(
    (id: number) => {
      const target = state.tasks.find((t) => t.id === id);
      if (!target) {
        showToast('Не вдалося знайти завдання для видалення', 'error');
        return;
      }

      if (editingTask?.id === id) {
        setEditingTask(null);
      }

      dispatch({ type: 'requestDelete', payload: id });
      showToast(
        `Завдання «${target.title}» буде видалено`,
        'warning',
        UNDO_TIMEOUT_MS,
        true,
      );
    },
    [state.tasks, editingTask, showToast],
  );

  const clearCompleted = useCallback(() => {
    const completed = state.tasks.filter((t) => t.completed);
    if (completed.length === 0) {
      showToast('Немає виконаних завдань для очищення', 'error');
      return;
    }

    if (editingTask && editingTask.completed) {
      setEditingTask(null);
    }

    dispatch({ type: 'clearCompleted' });
    showToast(
      `Видалення виконаних завдань (${completed.length})`,
      'warning',
      UNDO_TIMEOUT_MS,
      true,
    );
  }, [state.tasks, editingTask, showToast]);

  const undoDelete = useCallback(() => {
    dispatch({ type: 'undoDelete' });
    showToast('Видалення скасовано', 'info', 2200);
  }, [showToast]);

  const resetTasks = useCallback(() => {
    setEditingTask(null);
    dispatch({ type: 'reset', payload: initialTasks });
    showToast('Дані скинуто до початкового списку', 'info');
  }, [showToast]);

  const startEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const cancelEditTask = useCallback(() => {
    setEditingTask(null);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks: state.tasks,
      displayedTasks,
      filter,
      setFilter,
      sortOrder,
      setSortOrder,
      totalCount,
      completedCount,
      uncompletedCount,
      pendingDeletion: state.pendingDeletion,
      editingTask,
      toast,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      startEditTask,
      cancelEditTask,
      dismissToast,
    }),
    [
      state.tasks,
      state.pendingDeletion,
      displayedTasks,
      filter,
      setFilter,
      sortOrder,
      setSortOrder,
      totalCount,
      completedCount,
      uncompletedCount,
      editingTask,
      toast,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      startEditTask,
      cancelEditTask,
      dismissToast,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
