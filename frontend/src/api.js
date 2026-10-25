import axios from 'axios';

const client = axios.create({ timeout: 60000 });

// Clerk session token, attached to every API call (ignored by the API until it enforces auth).
let tokenGetter = null;
export const setTokenGetter = (fn) => {
  tokenGetter = fn;
};
client.interceptors.request.use(async (config) => {
  try {
    const token = tokenGetter && (await tokenGetter());
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    /* continue unauthenticated */
  }
  return config;
});

// FastAPI returns `detail` as a string (HTTPException) or a list of
// {loc, msg} objects (validation). Always reduce it to a printable string.
export function errorMessage(err) {
  if (!err.response) {
    return 'Cannot reach the prediction API. Is the backend running on port 8000?';
  }
  const detail = err.response.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => `${(d.loc || []).filter((l) => l !== 'body').join('.') || 'input'}: ${d.msg}`)
      .join('; ');
  }
  if (typeof detail === 'string') return detail;
  return `Request failed (${err.response.status})`;
}

export const getHealth = () => client.get('/health').then((r) => r.data);
export const getModelInfo = () => client.get('/model/info').then((r) => r.data);
export const predict = (sample) => client.post('/predict', sample).then((r) => r.data);
export const predictBatchCsv = (file) => {
  const body = new FormData();
  body.append('file', file);
  return client.post('/predict/batch', body).then((r) => r.data);
};

// Minimal Prometheus text parser: returns [{name, labels, value}].
export async function getMetrics() {
  const text = await client.get('/metrics', { responseType: 'text' }).then((r) => r.data);
  const out = [];
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([a-zA-Z_:][\w:]*)(?:\{(.*)\})?\s+(\S+)$/);
    if (!m) continue;
    const labels = {};
    for (const l of (m[2] || '').matchAll(/(\w+)="((?:[^"\\]|\\.)*)"/g)) labels[l[1]] = l[2];
    out.push({ name: m[1], labels, value: Number(m[3]) });
  }
  return out;
}

// Prediction history. The API stores every result in MongoDB; the browser copy
// is only a fallback for when the API has no database configured.
const KEY = 'milk_history_v1';

function toRow(d) {
  const inp = d.inputs;
  return {
    id: d.sample_id || (d.row != null ? `row ${d.row + 1}` : '-'),
    date: new Date(d.created_at).toLocaleString(),
    point: d.collection_point || '-',
    status: d.status,
    is_adulterated: d.is_adulterated,
    risk_score: d.risk_score,
    band: d.band,
    adulterant: d.adulterant,
    details:
      d.status === 'rejected'
        ? `Rejected: ${d.reject_reason}`
        : inp
          ? `Fat: ${inp.fat_pct}%, SNF: ${inp.snf_pct}%, Density: ${inp.density}, pH: ${inp.ph}, Freezing: ${inp.freezing_point}, Conductivity: ${inp.conductivity}`
          : `Source: ${d.collection_point || '-'}, row ${(d.row ?? 0) + 1}`,
  };
}

export function loadLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}
export async function loadHistory() {
  try {
    const docs = await client.get('/history/predictions', { params: { limit: 1000 } }).then((r) => r.data);
    return docs.map(toRow);
  } catch {
    return loadLocalHistory();
  }
}
export function addHistory(entries) {
  const next = [...entries, ...loadLocalHistory()].slice(0, 500);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  return next;
}
export async function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  try {
    await client.delete('/history/predictions');
  } catch {
    /* no database configured */
  }
}
