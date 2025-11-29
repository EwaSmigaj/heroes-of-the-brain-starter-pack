
import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-row">
        <img src="/plumbob.svg" alt="Plumbob" className="plumbob" />
        <h1>Moodlet Manager Wellness</h1>
      </div>
      <p className="subtitle">Pick a mood → do a session → see your progress</p>
    </header>
  );
}
