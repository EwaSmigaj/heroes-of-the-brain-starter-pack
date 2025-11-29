
import React from 'react';

const moods = [
  { key: 'focus', title: 'Focus', desc: 'Sharpen attention and reduce distraction.', icon: '/plumbob.svg' },
  { key: 'gratitude', title: 'Gratitude', desc: 'Foster positive, appreciative affect.', icon: '/plumbob.svg' },
  { key: 'calm', title: 'Calm', desc: 'Lower arousal and promote relaxation.', icon: '/plumbob.svg' }
];

export default function MoodSelector({ onPick }) {
  return (
    <section className="card">
      <h2>Pick your mood</h2>
      <div className="grid">
        {moods.map(m => (
          <button
            type="button"
            key={m.key}
            className={`tile ${m.key}`}
            onClick={() => onPick(m.key)}
          >
            <img src={m.icon} alt="" className="tile-icon" />
            <div className="tile-title">{m.title}</div>
            <div className="tile-desc">{m.desc}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
