import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../../api/tasks.api'
import type { CreateTaskInput, TaskFilters, UpdateTaskInput } from './task.types'

export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters: TaskFilters) => [...taskKeys.all, 'list', filters] as const,
}

export const useTasksQuery = (filters: TaskFilters) =>
  useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(filters),
  })

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) =>
      updateTask(taskId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
