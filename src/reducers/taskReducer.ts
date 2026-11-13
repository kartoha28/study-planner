import type { NewTaskDto, PendingDeletion, Task } from '../types/task';

export interface TaskState {
  tasks: Task[];
  pendingDeletion: PendingDeletion | null;
}

export type TaskAction =
  | { type: 'add'; payload: NewTaskDto }
  | { type: 'toggle'; payload: number }
  | { type: 'update'; payload: { id: number; data: NewTaskDto } }
  | { type: 'requestDelete'; payload: number }
  | { type: 'confirmDelete' }
  | { type: 'undoDelete' }
  | { type: 'clearCompleted' }
  | { type: 'reset'; payload: Task[] }
  | { type: 'syncFromStorage'; payload: Task[] };

function finalizePendingDeletion(state: TaskState): Task[] {
  if (!state.pendingDeletion) {
    return state.tasks;
  }
  const pendingIds = new Set(state.pendingDeletion.ids);
  return state.tasks.filter((task) => !pendingIds.has(task.id));
}

/**
 * Чиста reducer-функція для керування списком завдань та чергою Undoable Delete.
 * Не містить побічних ефектів (таймерів, localStorage, DOM або HTTP).
 */
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add': {
      const nextId =
        state.tasks.length > 0
          ? Math.max(...state.tasks.map((t) => t.id)) + 1
          : 1;
      const newTask: Task = {
        id: nextId,
        ...action.payload,
        completed: false,
      };
      return {
        ...state,
        tasks: [newTask, ...state.tasks],
      };
    }

    case 'toggle': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task,
        ),
      };
    }

    case 'update': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.data }
            : task,
        ),
      };
    }

    case 'requestDelete': {
      const activeTasks = finalizePendingDeletion(state);
      const target = activeTasks.find((t) => t.id === action.payload);
      if (!target) {
        return { tasks: activeTasks, pendingDeletion: null };
      }
      return {
        tasks: activeTasks,
        pendingDeletion: {
          ids: [target.id],
          mode: 'single',
          label: `Завдання «${target.title}» буде видалено`,
        },
      };
    }

    case 'clearCompleted': {
      const activeTasks = finalizePendingDeletion(state);
      const completedIds = activeTasks
        .filter((t) => t.completed)
        .map((t) => t.id);

      if (completedIds.length === 0) {
        return { tasks: activeTasks, pendingDeletion: null };
      }

      return {
        tasks: activeTasks,
        pendingDeletion: {
          ids: completedIds,
          mode: 'completed',
          label: `Видалення виконаних завдань (${completedIds.length})`,
        },
      };
    }

    case 'confirmDelete': {
      return {
        tasks: finalizePendingDeletion(state),
        pendingDeletion: null,
      };
    }

    case 'undoDelete': {
      return {
        ...state,
        pendingDeletion: null,
      };
    }

    case 'reset': {
      return {
        tasks: action.payload,
        pendingDeletion: null,
      };
    }

    case 'syncFromStorage': {
      return {
        tasks: action.payload,
        pendingDeletion: null,
      };
    }

    default:
      return state;
  }
}
