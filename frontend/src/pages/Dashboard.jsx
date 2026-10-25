import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, Download, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { getHealth, getModelInfo, getMetrics, errorMessage, loadHistory } from '../api';

function summarize(samples) {
  const sum = (pred) => samples.filter(pred).reduce((a, m) => a + m.value, 0);
  const preds = samples.filter((m) => m.name === 'milk_predictions_total');
  const bandCount = (b) => preds.filter((m) => m.labels.band === b).reduce((a, m) => a + m.value, 0);
  const bands = { accept: bandCount('accept'), retest: bandCount('retest'), reject: bandCount('reject') };
  const adulterants = {};
  preds.forEach((m) => {
    const a = m.labels.adulterant;
    if (a && a !== 'none') adulterants[a] = (adulterants[a] || 0) + m.value;
  });
  const total = bands.accept + bands.retest + bands.reject;
  const latSum = sum((m) => m.name === 'http_request_duration_seconds_sum' && m.labels.path === '/predict');
  const latCount = sum((m) => m.name === 'http_request_duration_seconds_count' && m.labels.path === '/predict');
  return {
    total,
    bands,
    flagged: total - bands.accept,
    rejectedRows: sum((m) => m.name === 'milk_rejected_rows_total'),
    latencyMs: latCount ? (latSum / latCount) * 1000 : null,
    adulterants: Object.entries(adulterants).sort((a, b) => b[1] - a[1]),
  };
}

const status = (r) => (r.status === 'rejected' ? 'Rejected' : r.is_adulterated ? 'Flagged' : r.band === 'retest' ? 'Retest' : 'Pure');
const PILL = {
  Pure: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Flagged: 'bg-red-50 text-red-700 border-red-200',
  Retest: 'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function Dashboard() {
  const [info, setInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [h, i, m] = await Promise.all([getHealth(), getModelInfo(), getMetrics()]);
        if (!alive) return;
        setHealth(h);
        setInfo(i);
        setStats(summarize(m));
        setError(null);
      } catch (err) {
        if (alive) setError(errorMessage(err));
      }
    };
    loadHistory().then((h) => alive && setHistory(h));
    load();
    const t = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const fmt = (n) => (n == null ? '-' : Math.round(n).toLocaleString());
  const flagRate = stats?.total ? (stats.flagged / stats.total) * 100 : null;

  const series = useMemo(
    () =>
      history
        .filter((r) => r.risk_score != null)
        .slice(0, 40)
        .reverse()
        .map((r, i) => ({ n: i + 1, id: r.id, risk: Math.round(r.risk_score * 1000) / 10 })),
    [history]
  );

  const rows = useMemo(
    () =>
      history
        .filter((r) => filter === 'All' || status(r) === filter)
        .filter((r) => `${r.id} ${r.point} ${r.adulterant || ''}`.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6),
    [history, q, filter]
  );

  const exportCsv = () => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = rows.map((r) => [r.id, r.point, status(r), r.risk_score ?? '', r.adulterant ?? '', r.date].map(esc).join(','));
    const blob = new Blob([['id,source,status,risk_score,adulterant,date', ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'recent-predictions.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const adulterantTotal = stats?.adulterants.reduce((a, [, v]) => a + v, 0) || 0;
  const kpis = [
    ['Samples Scored', fmt(stats?.total), `Model ${health?.model_version?.split('/').pop() || '-'}`],
    ['Flag Rate', flagRate == null ? '-' : `${flagRate.toFixed(1)}%`, 'Retest + reject'],
    ['Rejected Rows', fmt(stats?.rejectedRows), 'Failed validation'],
    ['Avg Latency', stats?.latencyMs == null ? '-' : `${stats.latencyMs.toFixed(1)} ms`, '/predict'],
  ];
  const card = 'bg-white border border-slate-200 rounded-2xl';

  return (
    <div className="space-y-4 w-full">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">{error}</div>}

      <div className={`${card} grid grid-cols-2 lg:grid-cols-4 bg-[#f7f7f7] divide-x divide-slate-200`}>
        {kpis.map(([label, value, sub]) => (
          <div key={label} className="p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${card} lg:col-span-2 p-5`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-600">Risk Score Trend</p>
              <p className="text-3xl font-medium text-slate-900 mt-3">{series.length ? `${series[series.length - 1].risk}%` : '-'}</p>
              <p className="text-xs text-slate-500 mt-1">Latest of your last {series.length} predictions</p>
            </div>
            <Link to="/analysis" className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1">New analysis <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          <div className="h-60 mt-4">
            {series.length ? (
              <ResponsiveContainer>
                <AreaChart data={series} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f172a" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="n" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Risk']} labelFormatter={(n, p) => p?.[0]?.payload?.id || `#${n}`} />
                  <Area type="monotone" dataKey="risk" stroke="#0f172a" strokeWidth={2} fill="url(#riskFill)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">Run a sample analysis to see the trend.</div>
            )}
          </div>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex justify-between items-start">
            <p className="text-sm text-slate-600">Detected Adulterants</p>
            <Link to="/data" className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          <p className="text-3xl font-medium text-slate-900 mt-3">{fmt(adulterantTotal)}</p>
          <p className="text-xs text-slate-500 mt-1">Samples with a named adulterant</p>
          <div className="mt-6 space-y-5">
            {stats?.adulterants.length ? (
              stats.adulterants.slice(0, 5).map(([name, count]) => {
                const pct = adulterantTotal ? (count / adulterantTotal) * 100 : 0;
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-slate-800">{name.replace(/_/g, ' ')}</span>
                      <span className="text-slate-500">{fmt(count)} <b className="text-slate-900 font-medium">({Math.round(pct)}%)</b></span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 py-8 text-center">None detected yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className={`${card} p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-slate-700">Recent Predictions</p>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="pl-9 pr-3 py-2 w-44 sm:w-56 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200" />
            </div>
            <label className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 text-sm cursor-pointer hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-transparent outline-none py-2 cursor-pointer">
                {['All', 'Pure', 'Flagged', 'Retest', 'Rejected'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <button onClick={exportCsv} disabled={!rows.length} className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 text-sm hover:bg-slate-50 disabled:opacity-50"><Download className="w-4 h-4" /> Export</button>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-sm min-w-[720px]">
            <thead>
              <tr className="text-slate-700 border-b border-slate-200">
                {['ID', 'Source', 'Risk', 'Status', 'Adulterant', 'Date', 'Action'].map((h) => <th key={h} className="py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">No predictions yet. Analyze a sample or upload a CSV.</td></tr>
              )}
              {rows.map((r, i) => (
                <tr key={`${r.id}-${i}`} className="border-b border-slate-100 last:border-0">
                  <td className="py-4 text-slate-800">{r.id}</td>
                  <td className="py-4 text-slate-800 max-w-[160px] truncate">{r.point}</td>
                  <td className="py-4 text-slate-800">{r.risk_score == null ? '-' : `${(r.risk_score * 100).toFixed(1)}%`}</td>
                  <td className="py-4"><span className={`px-2.5 py-0.5 rounded-md border text-xs ${PILL[status(r)]}`}>{status(r)}</span></td>
                  <td className="py-4 text-slate-800 capitalize">{r.adulterant ? r.adulterant.replace(/_/g, ' ') : '-'}</td>
                  <td className="py-4 text-slate-800">{r.date}</td>
                  <td className="py-4"><Link to="/data" className="text-slate-500 hover:text-slate-900"><MoreHorizontal className="w-4 h-4" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {info && (
          <p className="text-xs text-slate-400 mt-4">
            Model {info.model_version} · threshold {info.threshold?.toFixed?.(3) ?? info.threshold} · {info.adulterant_classes?.length} adulterant classes
          </p>
        )}
      </div>
    </div>
  );
}
