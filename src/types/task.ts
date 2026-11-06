export type Priority = 'low' | 'medium' | 'high';

export type FilterStatus = 'all' | 'completed' | 'uncompleted';

export type SortOrder = 'default' | 'priority-desc' | 'priority-asc';

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
