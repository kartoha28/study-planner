import { useContext } from 'react';
import { TaskContext, type TaskContextValue } from '../context/TaskContext';

/**
 * Custom hook для безпечного доступу до TaskContext.
 * Викидає зрозумілу помилку при виклику поза межами TaskProvider.
 */
export function useTaskContext(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error(
      'useTaskContext() повинен використовуватися всередині <TaskProvider>.',
    );
  }
  return context;
}
