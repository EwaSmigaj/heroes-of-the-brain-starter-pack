
const MOCK = true; // flip to false when your backend is ready

const delay = (ms) => new Promise(res => setTimeout(res, ms));
const rand = (min, max) => Math.random() * (max - min) + min;

// Produce mock BCI scan: alpha, beta, theta between ranges
const mockScan = () => ({
  alpha: rand(35, 75),
  beta: rand(25, 70),
  theta: rand(20, 60)
});

export async function connectHelmet() {
  if (MOCK) {
    await delay(600);
    return { connected: true, device: 'MockBCI v0' };
  }
  const res = await fetch('/api/bci/connect', { method: 'POST' });
  if (!res.ok) throw new Error('BCI connect failed');
  return res.json();
}

export async function scanBrain() {
  if (MOCK) {
    await delay(800);
    return mockScan();
  }
  const res = await fetch('/api/bci/scan');
  if (!res.ok) throw new Error('BCI scan failed');
  return res.json();
}

export async function startSession({ mood, exercise }) {
  if (MOCK) {
    return { ok: true };
  }
  const res = await fetch('/api/session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood, exercise })
  });
  if (!res.ok) throw new Error('Session start failed');
  return res.json();
}
