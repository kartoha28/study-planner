import { useCallback, useEffect, useState } from 'react';
import { isAbortError, normalizeHttpError } from '../api/httpClient';
import { taskRepository } from '../repositories/taskRepository';
import type { AsyncStatus, NewTaskDto, Task, ToastType } from '../types/task';

interface UseTasksOptions {
  page: number;
  pageSize: number;
  onNotify: (text: string, type: ToastType) => void;
}

export function useTasks({ page, pageSize, onNotify }: UseTasksOptions) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const loadTasks = async () => {
      setStatus('loading');
      setError(null);

      try {
        const skip = (page - 1) * pageSize;
        const result = await taskRepository.getAll({
          limit: pageSize,
          skip,
          signal: controller.signal,
        });

        if (!isCancelled) {
          setTasks(result.tasks);
          setTotal(result.total);
          setStatus('success');
        }
      } catch (err) {
        if (isCancelled || isAbortError(err)) {
          return;
        }
        const normalized = normalizeHttpError(err);
        setError(normalized.message);
        setStatus('error');
      }
    };

    void loadTasks();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [page, pageSize, reloadTick]);

  const retry = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  const createTask = useCallback(
    async (dto: NewTaskDto): Promise<void> => {
      try {
        const created = await taskRepository.create(dto);
        setTasks((prev) => {
          const hasSameId = prev.some((t) => t.id === created.id);
          const safeTask = hasSameId
            ? {
                ...created,
                id: Math.max(...prev.map((t) => t.id), 255) + 1,
              }
            : created;
          return [safeTask, ...prev];
        });
        setTotal((prev) => prev + 1);
        onNotify(`Створено завдання «${dto.title}»`, 'success');
      } catch (err) {
        const normalized = normalizeHttpError(err);
        onNotify(normalized.message, 'error');
        throw normalized;
      }
    },
    [onNotify],
  );

  const updateTask = useCallback(
    async (id: number, dto: NewTaskDto): Promise<void> => {
      try {
        const updatedFields = await taskRepository.update(id, dto);
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, ...updatedFields } : task,
          ),
        );
        onNotify(`Завдання «${dto.title}» оновлено`, 'success');
      } catch (err) {
        const normalized = normalizeHttpError(err);
        onNotify(normalized.message, 'error');
        throw normalized;
      }
    },
    [onNotify],
  );

  // Optimistic update: миттєво змінюємо UI, а при помилці API відкочуємо назад
  const toggleTask = useCallback(
    async (id: number): Promise<void> => {
      const target = tasks.find((t) => t.id === id);
      if (!target) {
        return;
      }

      const previousCompleted = target.completed;
      const nextCompleted = !previousCompleted;

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t)),
      );

      try {
        await taskRepository.update(id, { completed: nextCompleted });
      } catch (err) {
        // Rollback при помилці сервера
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: previousCompleted } : t,
          ),
        );
        const normalized = normalizeHttpError(err);
        onNotify(`Не вдалося оновити статус: ${normalized.message}`, 'error');
      }
    },
    [tasks, onNotify],
  );

  const deleteTask = useCallback(
    async (id: number): Promise<void> => {
      try {
        await taskRepository.delete(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
        onNotify('Завдання видалено', 'success');
      } catch (err) {
        const normalized = normalizeHttpError(err);
        onNotify(`Помилка видалення: ${normalized.message}`, 'error');
        throw normalized;
      }
    },
    [onNotify],
  );

  return {
    tasks,
    total,
    status,
    error,
    retry,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
}
