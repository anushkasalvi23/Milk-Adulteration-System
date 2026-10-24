import React, { useRef, useState } from 'react';
import { Database, Upload, Download, ChevronRight, X, Trash2 } from 'lucide-react';
import { predictBatchCsv, errorMessage, loadHistory, addHistory, clearHistory } from '../api';

const PAGE_SIZE = 10;

export default function DataExplorer() {
  const [rows, setRows] = useState(loadHistory);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError(null);
    setNotice(null);
    try {
      const data = await predictBatchCsv(file);
      const now = new Date().toLocaleString();
      const entries = data.results.map((r) => ({
        id: r.sample_id || `row ${r.row + 1}`,
        date: now,
        point: file.name,
        status: r.status,
        is_adulterated: r.is_adulterated,
        risk_score: r.risk_score,
        band: r.band,
        adulterant: r.adulterant,
        details: r.status === 'rejected' ? `Rejected: ${r.reject_reason}` : `Source: ${file.name}, row ${r.row + 1}`,
      }));
      setRows(addHistory(entries));
      setPage(0);
      const s = data.summary;
      setNotice(`${file.name}: ${s.scored} scored, ${s.rejected} rejected, ${s.flagged} flagged.`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleExport = () => {
    const header = ['sample_id', 'timestamp', 'source', 'result', 'risk_score', 'band', 'adulterant'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = rows.map((r) => [r.id, r.date, r.point, resultLabel(r), r.risk_score ?? '', r.band ?? '', r.adulterant ?? ''].map(esc).join(','));
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'predictions.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleClear = () => {
    clearHistory();
    setRows([]);
    setSelectedRow(null);
    setPage(0);
  };

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prediction Log</h1>
          <p className="text-slate-500 text-sm mt-1">
            Results from Sample Analysis and CSV uploads, stored in this browser. CSV needs columns fat_pct, snf_pct, density, ph, freezing_point, conductivity.
          </p>
        </div>
        <div className="flex gap-3">
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-60">
            <Upload className="w-4 h-4" /> {uploading ? 'Scoring...' : 'Upload CSV'}
          </button>
          <button onClick={handleExport} disabled={!rows.length} className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleClear} disabled={!rows.length} title="Clear log" className="p-2 bg-white border border-slate-300 text-slate-500 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">{error}</div>}
      {notice && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm">{notice}</div>}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Sample ID', 'Timestamp', 'Source', 'Result', 'Risk Score', 'Adulterant', ''].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">
                    <Database className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    No predictions yet. Run a sample or upload a CSV.
                  </td>
                </tr>
              )}
              {visible.map((row, i) => (
                <tr key={`${row.id}-${page}-${i}`} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{row.point}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass(row)}`}>
                      {resultLabel(row)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                    {row.risk_score == null ? '-' : `${(row.risk_score * 100).toFixed(1)}%`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.adulterant ? row.adulterant.replace(/_/g, ' ') : 'None'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setSelectedRow(row)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-sm text-slate-500">
            Showing {visible.length} of {rows.length} records (latest 500 kept)
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors text-sm disabled:text-slate-300">Previous</button>
            <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1} className="px-3 py-1 bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors text-sm disabled:text-slate-300">Next</button>
          </div>
        </div>

        {selectedRow && (
          <div className="absolute inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl p-6 z-10 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900">Sample Details</h3>
              <button onClick={() => setSelectedRow(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 flex-1 overflow-auto">
              <Field label="ID" value={selectedRow.id} />
              <Field label="Result" value={resultLabel(selectedRow)} />
              <Field label="Band" value={selectedRow.band || '-'} />
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Details</p>
                <div className="mt-1 p-3 bg-slate-50 rounded border border-slate-200 text-sm text-slate-700 space-y-1">
                  {selectedRow.details.split(', ').map((line) => <div key={line}>{line}</div>)}
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedRow(null)} className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded transition-colors text-sm">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function resultLabel(r) {
  if (r.status === 'rejected') return 'Rejected';
  return r.is_adulterated ? 'Adulterated' : r.band === 'retest' ? 'Retest' : 'Pure';
}

function badgeClass(r) {
  const label = resultLabel(r);
  if (label === 'Pure') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (label === 'Adulterated') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase font-semibold">{label}</p>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  );
}
