
import React from 'react';

const EXERCISES = {
  focus: [
    { id: 'pomodoro_breath', name: 'Box Breathing', minutes: 5, desc: '4-4-4-4 breathing to stabilize attention.' },
    { id: 'deep_focus', name: 'Focused Sound', minutes: 10, desc: 'Binaural beats or white noise.' },
    { id: 'visual_focus', name: 'Gaze Anchoring', minutes: 7, desc: 'Fix gaze on a point and note distractions.' }
  ],
  gratitude: [
    { id: 'grat_journaling', name: '3 Gratitude Notes', minutes: 6, desc: 'Write three specific appreciations.' },
    { id: 'loving_kindness', name: 'Loving-Kindness', minutes: 10, desc: 'Send goodwill to self & others.' },
    { id: 'photo_reflection', name: 'Photo Reflection', minutes: 5, desc: 'Reflect on meaningful moments.' }
  ],
  calm: [
    { id: 'body_scan', name: 'Body Scan', minutes: 8, desc: 'Release tension progressively.' },
    { id: 'slow_breath', name: 'Coherent Breathing', minutes: 10, desc: '5–6 breaths per minute.' },
    { id: 'nature_audio', name: 'Nature Audio', minutes: 7, desc: 'Listen to calming ambient sounds.' }
  ]
};

export default function SessionPlanner({ mood, onStart }) {
  const list = EXERCISES[mood] || [];
  return (
    <section className="card">
      <h2>Proposed session for <span className="badge">{mood}</span></h2>
      <div className="grid">
        {list.map(ex => (
          <div key={ex.id} className="exercise">
            <div className="exercise-header">
              <div className="exercise-name">{ex.name}</div>
              <div className="exercise-time">{ex.minutes} min</div>
            </div>
            <p className="exercise-desc">{ex.desc}</p>
            <button
              type="button"
              className="btn"
              onClick={() => onStart(ex)}
            >
              Start session
            </button>
          </div>
        ))}
      </div>
      <p className="muted">Pick one to begin. A timer will start, then we’ll scan again.</p>
    </section>
  );
}
