import type { Task } from '../types/task';

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'React Components',
    description: 'Опрацювати базові принципи компонентів React та декомпозицію інтерфейсу',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 2,
    title: 'TypeScript Exercises',
    description: 'Виконати практичні вправи на типізацію props, state та callback-подій',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
  },
  {
    id: 3,
    title: 'JSX & Conditional Rendering',
    description: 'Розібратися з тернарними операторами та логічним && для повідомлень про порожній список',
    completed: false,
    priority: 'low',
    category: 'React',
  },
  {
    id: 4,
    title: 'BEM & SCSS Styling',
    description: 'Написати модульні та семантичні BEM-класи для карток завдань та фільтрів',
    completed: true,
    priority: 'high',
    category: 'Styling',
  },
];
