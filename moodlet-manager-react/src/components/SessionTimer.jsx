
import React, { useEffect, useState } from 'react';

export default function SessionTimer({ exercise, onComplete, onCancel }) {
  const totalSeconds = exercise.minutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) onComplete();
  }, [secondsLeft, onComplete]);

  const pct = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  return (
    <section className="card">
      <h2>Session in progress</h2>
      <div className="session-name">{exercise.name}</div>
      <div className="session-time">
        {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
      </div>


      {/* <div className="radial" style={{ background: `conic-gradient(var(--accent) ${pct * 3.6}deg, #eee 0)` }}>
        <div className="radial-inner">{pct}%</div>
      </div> */}

      <div className="actions">
        <button
          type="button"
          className="btn secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
      <p className="muted">Keep going—your post-session scan will run when the timer ends.</p>
    </section>
  );
}
