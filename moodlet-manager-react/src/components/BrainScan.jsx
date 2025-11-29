
import React from 'react';

export default function BrainScan({ title, buttonLabel, onAction, scan, disabled }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p className="muted">
        We’ll take a snapshot of general brainwave bands (alpha, beta, theta). This is a placeholder—replace with
        your BCI SDK metrics.
      </p>
      <button
        type="button"
        className="btn primary"
        onClick={onAction}
        disabled={disabled}
      >
        {buttonLabel}
      </button>

      {scan && (
        <div className="scan-grid">
          <div className="scan-item">
            <div className="label">Alpha</div>
            <div className="value">{scan.alpha.toFixed(1)}</div>
          </div>
          <div className="scan-item">
            <div className="label">Beta</div>
            <div className="value">{scan.beta.toFixed(1)}</div>
          </div>
          <div className="scan-item">
            <div className="label">Theta</div>
            <div className="value">{scan.theta.toFixed(1)}</div>
          </div>
        </div>
      )}
    </section>
  );
}
