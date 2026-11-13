import React from 'react';
import { Header } from './components/Header';
import { TaskFilters } from './components/TaskFilters';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskStats } from './components/TaskStats';
import { Toast } from './components/Toast';
import { TaskProvider } from './context/TaskContext';
import { useTaskContext } from './hooks/useTaskContext';
import './styles/global.scss';

const StudyPlannerContent: React.FC = () => {
  const { displayedTasks, totalCount, editingTask } = useTaskContext();

  return (
    <div className="study-planner">
      <Header />

      <main className="study-planner__main">
        <div className="study-planner__container">
          <TaskStats />

          <TaskForm key={editingTask ? `edit-${editingTask.id}` : 'create'} />

          <section className="study-planner__list-section">
            <div className="study-planner__list-header">
              <h2 className="study-planner__list-title">Список завдань</h2>
              <span className="study-planner__list-count">
                Відображається: {displayedTasks.length} з {totalCount}
              </span>
            </div>

            <TaskFilters />

            <TaskList />
          </section>
        </div>
      </main>

      <footer className="footer">
        <p className="footer__text">Study Planner • Владислав Іванів</p>
      </footer>

      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TaskProvider>
      <StudyPlannerContent />
    </TaskProvider>
  );
};

export default App;
