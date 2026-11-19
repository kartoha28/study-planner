export type Priority = 'low' | 'medium' | 'high';

export type FilterStatus = 'all' | 'completed' | 'uncompleted';

export type SortOrder = 'default' | 'priority-desc' | 'priority-asc';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}

export interface NewTaskDto {
  title: string;
  description: string;
  category: string;
  priority: Priority;
}

export type UpdateTaskDto = Partial<
  Pick<Task, 'title' | 'description' | 'completed' | 'priority' | 'category'>
>;

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
  durationMs: number;
}
