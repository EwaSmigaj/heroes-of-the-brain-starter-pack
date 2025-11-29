
import React, { useState } from 'react';
import Header from './components/Header.jsx';
import BrainScan from './components/BrainScan.jsx';
import MoodSelector from './components/MoodSelector.jsx';
import SessionPlanner from './components/SessionPlanner.jsx';
import SessionTimer from './components/SessionTimer.jsx';
import ProgressTracker from './components/ProgressTracker.jsx';
import { connectHelmet, scanBrain } from './services/api.js';
import { calculateMoodProgress } from './utils/scoring.js';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [initialScan, setInitialScan] = useState(null);
  const [finalScan, setFinalScan] = useState(null);
  const [mood, setMood] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await connectHelmet();
      setConnected(res.connected);
      if (!res.connected) throw new Error('BCI helmet not connected.');
    } catch (e) {
      setError(e.message || 'Failed to connect helmet.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialScan = async () => {
    setError('');
    setLoading(true);
    try {
      const scan = await scanBrain();
      setInitialScan(scan);
    } catch (e) {
      setError(e.message || 'Initial scan failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostScan = async () => {
    setError('');
    setLoading(true);
    try {
      const scan = await scanBrain();
      setFinalScan(scan);
      const prog = calculateMoodProgress(mood, initialScan, scan);
      setProgress(prog);
    } catch (e) {
      setError(e.message || 'Post-session scan failed.');
    } finally {
      setLoading(false);
    }
  };

  const startSession = (exercise) => {
    setSelectedExercise(exercise);
    setSessionActive(true);
  };

  const endSession = async () => {
    setSessionActive(false);
    await handlePostScan();
  };

  const resetAll = () => {
    setConnected(false);
    setInitialScan(null);
    setFinalScan(null);
    setMood(null);
    setSelectedExercise(null);
    setSessionActive(false);
    setProgress(null);
    setError('');
    setLoading(false);
  };

  return (
    <div className="app">
      <Header />

      <main className="container">
        {error && <div className="alert error">{error}</div>}

        {!connected ? (
          <BrainScan
            title="Connect your BCI helmet"
            buttonLabel={loading ? 'Connecting...' : 'Connect & Scan'}
            onAction={async () => {
              await handleConnect();
              if (!error) await handleInitialScan();
            }}
            scan={initialScan}
            disabled={loading}
          />
        ) : !initialScan ? (
          <BrainScan
            title="Initial brain scan"
            buttonLabel={loading ? 'Scanning...' : 'Start Scan'}
            onAction={handleInitialScan}
            scan={initialScan}
            disabled={loading}
          />
        ) : !mood ? (
          <MoodSelector onPick={setMood} />
        ) : !selectedExercise ? (
          <SessionPlanner mood={mood} onStart={startSession} />
        ) : sessionActive ? (
          <SessionTimer
            exercise={selectedExercise}
            onComplete={endSession}
            onCancel={() => setSessionActive(false)}
          />
        ) : !finalScan ? (
          <BrainScan
            title="Post-session scan"
            buttonLabel={loading ? 'Scanning...' : 'Scan Again'}
            onAction={handlePostScan}
            scan={finalScan}
            disabled={loading}
          />
        ) : (
          <ProgressTracker
            mood={mood}
            initial={initialScan}
            final={finalScan}
            progress={progress}
            onRestart={resetAll}
          />
        )}
      </main>

      <footer className="footer">
        <button type="button" className="link" onClick={resetAll}>
          Start over
        </button>
      </footer>
    </div>
  );
}
