import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__badge">Лабораторна робота №8</div>
        <h1 className="header__title">
          <span className="header__icon">📚</span> Study Planner
        </h1>
        <p className="header__subtitle">
          Планувальник навчальних завдань • React 19 • TypeScript • BEM
        </p>
      </div>
    </header>
  );
};
