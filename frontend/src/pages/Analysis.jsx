import React, { useState } from 'react';
import CsvUpload from './CsvUpload';
import { predict, errorMessage, addHistory } from '../api';
import { Shield, ShieldAlert, CheckCircle, Activity, Droplet, FlaskConical, AlertTriangle } from 'lucide-react';

function SingleSample() {
  const [formData, setFormData] = useState({
    sample_id: 'S-2051',
    collection_point: 'Zone A - Center 42',
    fat_pct: 4.5,
    snf_pct: 8.5,
    density: 1.028,
    ph: 6.7,
    freezing_point: -0.54,
    conductivity: 4.5
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const payload = {
        ...formData,
        sample_id: formData.sample_id || null,
        collection_point: formData.collection_point || null,
      };
      const data = await predict(payload);
      setResult(data);
      addHistory([{
        id: data.sample_id || '-',
        date: new Date().toLocaleString(),
        point: payload.collection_point || '-',
        is_adulterated: data.is_adulterated,
        risk_score: data.risk_score,
        band: data.band,
        adulterant: data.adulterant,
        details: `Fat: ${payload.fat_pct}%, SNF: ${payload.snf_pct}%, Density: ${payload.density}, pH: ${payload.ph}, Freezing: ${payload.freezing_point}, Conductivity: ${payload.conductivity}`,
      }]);
    } catch (err) {
      setResult(null);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sample Analysis</h1>
        <p className="text-slate-500 text-sm mt-1">Run individual sensor readings through the testing system.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <FlaskConical size={18} className="text-blue-500"/>
                Input Telemetry
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup label="Sample ID" name="sample_id" value={formData.sample_id} onChange={handleChange} type="text" />
                <InputGroup label="Collection Point" name="collection_point" value={formData.collection_point} onChange={handleChange} type="text" />
                <InputGroup label="Fat (%)" name="fat_pct" value={formData.fat_pct} onChange={handleChange} type="number" step="0.1" suffix="%" />
                <InputGroup label="SNF (%)" name="snf_pct" value={formData.snf_pct} onChange={handleChange} type="number" step="0.1" suffix="%" />
                <InputGroup label="Density" name="density" value={formData.density} onChange={handleChange} type="number" step="0.001" />
                <InputGroup label="pH" name="ph" value={formData.ph} onChange={handleChange} type="number" step="0.1" />
                <InputGroup label="Freezing Point" name="freezing_point" value={formData.freezing_point} onChange={handleChange} type="number" step="0.01" suffix="°C" />
                <InputGroup label="Conductivity" name="conductivity" value={formData.conductivity} onChange={handleChange} type="number" step="0.1" suffix="mS/cm" />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-70 flex items-center gap-2 transition-all shadow-sm"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Activity size={18} />
                  )}
                  Execute Analysis
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-800">Result Output</h2>
            </div>
            
            <div className="p-6">
              {error && !result && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex gap-3 mb-6">
                  <AlertTriangle className="shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">System Error</h4>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}
              
              {!result && !error && (
                <div className="text-center py-16 flex flex-col items-center justify-center text-slate-400">
                  <Shield size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">Awaiting payload for evaluation...</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                      result.is_adulterated ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {result.is_adulterated ? <ShieldAlert size={48} /> : <CheckCircle size={48} />}
                    </div>
                    <h3 className={`text-2xl font-bold tracking-tight ${result.is_adulterated ? 'text-red-700' : 'text-emerald-700'}`}>
                      {result.is_adulterated ? 'Adulterated Material' : 'Verified Pure'}
                    </h3>
                    <p className="text-xs font-bold mt-2 text-slate-500 uppercase tracking-widest">
                      Risk Band: <span className="text-slate-800">{result.band}</span>
                    </p>
                  </div>
                  
                  <div className="p-5 bg-slate-50 rounded-xl space-y-4 border border-slate-100">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-600">Risk Score</span>
                        <span className="font-bold text-slate-900">{(result.risk_score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${result.risk_score > 0.5 ? 'bg-red-500' : result.risk_score > 0.2 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${result.risk_score * 100}%` }}></div>
                      </div>
                    </div>
                    
                    {result.adulterant && result.adulterant !== 'none' && (
                      <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                        <span className="text-sm font-medium text-slate-600">Detected Signature</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-full uppercase tracking-wider">
                          {result.adulterant.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}

                    {result.confidence != null && (
                       <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                         <span className="text-sm font-medium text-slate-600">Confidence</span>
                         <span className="text-sm font-semibold text-slate-900">{(result.confidence * 100).toFixed(1)}%</span>
                       </div>
                    )}
                  </div>
                  
                  {result.unusual_readings && result.unusual_readings.length > 0 && (
                    <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 flex gap-3 text-sm">
                      <AlertTriangle className="shrink-0 text-amber-600" size={18} />
                      <div>
                        <span className="font-semibold text-amber-900 block mb-1">Anomalous Telemetry</span>
                        <ul className="list-disc pl-4 space-y-1 text-amber-800">
                          {result.unusual_readings.map((reading, i) => (
                            <li key={i}>{reading}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
                    <Activity className="w-3 h-3" />
                    Model: {result.model_version || 'Production-v1'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, name, value, onChange, type, step, suffix }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input 
          type={type} step={step} name={name} value={value} onChange={onChange} required
          className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400 sm:text-sm" 
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-sm font-medium">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Analysis() {
  const [tab, setTab] = useState('single');
  const tabs = [['single', 'Single sample'], ['csv', 'Upload CSV']];
  return (
    <div className="w-full space-y-6">
      <div className="inline-flex bg-slate-100 rounded-xl p-1">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-5 py-2 text-sm rounded-lg transition-colors ${tab === k ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>{l}</button>
        ))}
      </div>
      {tab === 'single' ? <SingleSample /> : <CsvUpload />}
    </div>
  );
}
