
const MOCK = true; // flip to false when your backend is ready

const delay = (ms) => new Promise(res => setTimeout(res, ms));
const rand = (min, max) => Math.random() * (max - min) + min;

// Produce mock BCI scan: alpha, beta, theta between ranges
const mockScan = () => ({
  stressLvl: rand(35, 75),
  happinessLvl: rand(25, 70)
});

export async function scanBrain() {
  if (MOCK) {
    await delay(800);
    return mockScan();
  }
  
  // Create AbortController with 35 second timeout (5s buffer beyond expected 30s)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);
  
  try {
    const res = await fetch('/api/bci/scan', {
      signal: controller.signal,
      // Optional: let server know client is willing to wait
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error('BCI scan failed');
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('BCI scan timed out after 35 seconds');
    }
    throw error;
  }
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
