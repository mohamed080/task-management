import type {
  CreateTaskInput,
  Task,
  TaskFilters,
  TaskListResponse,
  UpdateTaskInput,
} from '../features/tasks/task.types'
import { apiRequest } from './http'

export const getTasks = (filters: TaskFilters) => {
  const params = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  })

  if (filters.search) {
    params.set('search', filters.search)
  }
  if (filters.status !== 'all') {
    params.set('status', filters.status)
  }
  if (filters.priority !== 'all') {
    params.set('priority', filters.priority)
  }

  return apiRequest<TaskListResponse>(`/tasks?${params.toString()}`)
}

export const createTask = (input: CreateTaskInput) =>
  apiRequest<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  })

export const updateTask = (taskId: string, input: UpdateTaskInput) =>
  apiRequest<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })

export const deleteTask = (taskId: string) =>
  apiRequest<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
