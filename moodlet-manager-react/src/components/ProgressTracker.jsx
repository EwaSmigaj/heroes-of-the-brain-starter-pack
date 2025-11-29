
import React from 'react';

export default function ProgressTracker({ mood, initial, final, progress, onRestart }) {
  return (
    <section className="card">
      <h2>Results</h2>
      <div className="progress-layout">
        <div className="progress-block">
          <div className="block-title">Target mood</div>
          <div className="badge">{mood}</div>
        </div>

        <div className="progress-block">
          <div className="block-title">Improvement</div>
          <div className="radial large" style={{ background: `conic-gradient(var(--accent) ${progress.percentage * 3.6}deg, #eee 0)` }}>
            <div className="radial-inner">{Math.round(progress.percentage)}%</div>
          </div>
          <div className="muted">{progress.message}</div>
        </div>

        <div className="progress-block">
          <div className="block-title">Scans (alpha / beta / theta)</div>
          <div className="scan-grid compact">
            <div className="scan-item">
              <div className="label">Initial</div>
              <div className="value small">
                {initial.alpha.toFixed(1)} / {initial.beta.toFixed(1)} / {initial.theta.toFixed(1)}
              </div>
            </div>
            <div className="scan-item">
              <div className="label">Final</div>
              <div className="value small">
                {final.alpha.toFixed(1)} / {final.beta.toFixed(1)} / {final.theta.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn"
          onClick={onRestart}
        >
          Start over
        </button>
      </div>
    </section>
  );
}
