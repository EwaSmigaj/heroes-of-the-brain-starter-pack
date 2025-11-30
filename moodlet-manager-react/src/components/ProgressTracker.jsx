
import { Minimize } from 'lucide-react';
import React from 'react';

export default function ProgressTracker({ mood, initial, final, onRestart }) {
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
          <div className="radial large" style={{ background: `conic-gradient(var(--accent) ${(67) * 3.6}deg, #eee 0)` }}>
            <div className="radial-inner">{Math.round(Math.max(0,(6)))}%</div>
          </div>
          {(() => {
      const improvement = initial.stressLvl - final.stressLvl;
      if (improvement >= 30) return "Excellent progress!";
      if (improvement >= 20) return "Great job!";
      if (improvement >= 10) return "Good work!";
      if (improvement > 0) return "Keep it up!";
      return "Try again next time!";
    })()}
        </div>

        <div className="progress-block">
          <div className="block-title">Scans (stressLvl)</div>
          <div className="scan-grid compact">
            <div className="scan-item">
              <div className="label">Initial</div>
              <div className="value small">
                {initial.stressLvl.toFixed(1)}
              </div>
            </div>
            <div className="scan-item">
              <div className="label">Final</div>
              <div className="value small">
                {final.stressLvl.toFixed(1)}
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
