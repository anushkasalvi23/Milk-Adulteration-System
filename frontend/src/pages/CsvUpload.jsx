import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Download, AlertTriangle, X, Activity } from 'lucide-react';
import { predictBatchCsv, errorMessage, addHistory } from '../api';

const TEMPLATE =
  'sample_id,collection_point,fat_pct,snf_pct,density,ph,freezing_point,conductivity\n' +
  'S-001,Village Center,3.4,8.7,1.029,6.68,-0.53,4.85\n' +
  'S-002,Village Center,2.1,6.2,1.018,6.60,-0.38,5.40\n';

const PILL = {
  Pure: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Flagged: 'bg-red-50 text-red-700 border-red-200',
  Retest: 'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-slate-100 text-slate-600 border-slate-200',
};
const label = (r) => (r.status === 'rejected' ? 'Rejected' : r.is_adulterated ? 'Flagged' : r.band === 'retest' ? 'Retest' : 'Pure');

export default function CsvUpload() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const pick = (f) => {
    setError(null);
    setData(null);
    if (f && !/\.csv$/i.test(f.name)) {
      setFile(null);
      setError('Please choose a .csv file.');
      return;
    }
    setFile(f || null);
  };

  const run = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await predictBatchCsv(file);
      setData(res);
      const now = new Date().toLocaleString();
      addHistory(
        res.results.map((r) => ({
          id: r.sample_id || `row ${r.row + 1}`,
          date: now,
          point: file.name,
          status: r.status,
          is_adulterated: r.is_adulterated,
          risk_score: r.risk_score,
          band: r.band,
          adulterant: r.adulterant,
          details: r.status === 'rejected' ? `Rejected: ${r.reject_reason}` : `Source: ${file.name}, row ${r.row + 1}`,
        }))
      );
    } catch (err) {
      setData(null);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([TEMPLATE], { type: 'text/csv' }));
    a.download = 'samples_template.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const s = data?.summary;
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Upload samples CSV</h2>
            <p className="text-sm text-slate-500">Up to 10,000 rows. Required columns: fat_pct, snf_pct, density, ph, freezing_point, conductivity. Optional: sample_id, collection_point.</p>
          </div>
          <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50"><Download className="w-4 h-4" /> Template</button>
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
          className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${drag ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}
        >
          <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
          {file ? (
            <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm" onClick={(e) => e.stopPropagation()}>
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-slate-800">{file.name}</span>
              <span className="text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
              <button onClick={() => pick(null)} aria-label="Remove file" className="text-slate-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-slate-400" />
              <p className="mt-3 text-sm text-slate-700"><b>Click to choose</b> or drag and drop a CSV file</p>
            </>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={run} disabled={!file || loading} className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2 text-sm">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Activity size={16} />}
            Analyze CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex gap-3 text-sm">
          <AlertTriangle className="shrink-0 w-5 h-5" /> <p>{error}</p>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            {[['Rows', s.rows], ['Scored', s.scored], ['Rejected', s.rejected], ['Flagged', s.flagged], ['Flag rate', `${(s.flag_rate * 100).toFixed(1)}%`]].map(([l, v]) => (
              <div key={l} className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500">{l}</p><p className="text-2xl font-medium text-slate-900">{v}</p></div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mb-3">Bands: accept {s.bands.accept ?? 0} · retest {s.bands.retest ?? 0} · reject {s.bands.reject ?? 0}. Results were also added to the Prediction Log.</p>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-slate-700">{['Row', 'Sample ID', 'Status', 'Risk', 'Band', 'Adulterant / reason'].map((h) => <th key={h} className="py-2 pr-4 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.results.map((r) => (
                  <tr key={r.row} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 text-slate-500">{r.row + 1}</td>
                    <td className="py-2.5 pr-4">{r.sample_id || '-'}</td>
                    <td className="py-2.5 pr-4"><span className={`px-2 py-0.5 rounded-md border text-xs ${PILL[label(r)]}`}>{label(r)}</span></td>
                    <td className="py-2.5 pr-4">{r.risk_score == null ? '-' : `${(r.risk_score * 100).toFixed(1)}%`}</td>
                    <td className="py-2.5 pr-4 capitalize">{r.band || '-'}</td>
                    <td className="py-2.5 pr-4 capitalize">{r.status === 'rejected' ? r.reject_reason : r.adulterant ? r.adulterant.replace(/_/g, ' ') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
