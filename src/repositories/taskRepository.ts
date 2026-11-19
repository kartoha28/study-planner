import { httpClient } from '../api/httpClient';
import type { NewTaskDto, Task, UpdateTaskDto } from '../types/task';

interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodosResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}

interface DeleteTodoResponse extends ApiTodo {
  isDeleted: boolean;
  deletedOn: string;
}

export interface PaginatedTasksResult {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
}

function toTask(apiTodo: ApiTodo): Task {
  return {
    id: apiTodo.id,
    title: apiTodo.todo,
    description: '',
    completed: apiTodo.completed,
    priority: 'medium',
    category: 'General',
  };
}

export const taskRepository = {
  async getAll(params: {
    limit: number;
    skip: number;
    signal?: AbortSignal;
  }): Promise<PaginatedTasksResult> {
    const { limit, skip, signal } = params;
    const data = await httpClient.get<TodosResponse>(
      `/todos?limit=${limit}&skip=${skip}`,
      signal,
    );

    return {
      tasks: data.todos.map(toTask),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const data = await httpClient.get<ApiTodo>(`/todos/${id}`, signal);
    return toTask(data);
  },

  async create(dto: NewTaskDto, signal?: AbortSignal): Promise<Task> {
    const data = await httpClient.post<ApiTodo>(
      '/todos/add',
      {
        todo: dto.title,
        completed: false,
        userId: 1,
      },
      signal,
    );

    // DummyJSON не зберігає description/priority/category, тож зберігаємо їх як client-only metadata
    return {
      ...toTask(data),
      description: dto.description,
      priority: dto.priority,
      category: dto.category,
    };
  },

  async update(
    id: number,
    updates: UpdateTaskDto,
    signal?: AbortSignal,
  ): Promise<Partial<Task> & { id: number }> {
    const apiPayload: Record<string, unknown> = {};
    if (updates.title !== undefined) {
      apiPayload.todo = updates.title;
    }
    if (updates.completed !== undefined) {
      apiPayload.completed = updates.completed;
    }

    const data = await httpClient.patch<ApiTodo>(
      `/todos/${id}`,
      apiPayload,
      signal,
    );

    return {
      id: data.id,
      title: data.todo,
      completed: data.completed,
      ...(updates.description !== undefined && {
        description: updates.description,
      }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      ...(updates.category !== undefined && { category: updates.category }),
    };
  },

  async delete(id: number, signal?: AbortSignal): Promise<void> {
    await httpClient.delete<DeleteTodoResponse>(`/todos/${id}`, signal);
  },
};
