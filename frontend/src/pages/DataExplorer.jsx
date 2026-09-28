import React, { useState } from 'react';
import { Database, Filter, Download, ChevronRight, X } from 'lucide-react';

const MOCK_DATA = [
  { id: 'S-9921', date: '2026-09-28 08:12', point: 'North Hub', result: 'Pure', risk: '1.2%', adulterant: 'None', details: 'Fat: 4.5%, SNF: 8.5%, Density: 1.028' },
  { id: 'S-9922', date: '2026-09-28 08:15', point: 'North Hub', result: 'Adulterated', risk: '98.5%', adulterant: 'Water', details: 'Fat: 2.1%, SNF: 6.2%, Density: 1.015' },
  { id: 'S-9923', date: '2026-09-28 08:22', point: 'East Hub', result: 'Pure', risk: '0.5%', adulterant: 'None', details: 'Fat: 5.1%, SNF: 8.8%, Density: 1.030' },
  { id: 'S-9924', date: '2026-09-28 08:45', point: 'West Hub', result: 'Pure', risk: '12.0%', adulterant: 'None', details: 'Fat: 3.5%, SNF: 8.1%, Density: 1.025' },
  { id: 'S-9925', date: '2026-09-28 09:02', point: 'South Hub', result: 'Adulterated', risk: '85.2%', adulterant: 'Urea', details: 'Fat: 4.0%, SNF: 9.5%, Density: 1.031' },
  { id: 'S-9926', date: '2026-09-28 09:14', point: 'East Hub', result: 'Pure', risk: '4.1%', adulterant: 'None', details: 'Fat: 4.2%, SNF: 8.4%, Density: 1.027' },
  { id: 'S-9927', date: '2026-09-28 09:30', point: 'North Hub', result: 'Adulterated', risk: '76.8%', adulterant: 'Starch', details: 'Fat: 3.8%, SNF: 9.2%, Density: 1.029' },
];

export default function DataExplorer() {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleExport = () => {
    alert("Exporting CSV file... (Demo action)");
  };

  const handleFilter = () => {
    alert("Opening advanced filters... (Demo action)");
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Historical Data Log</h1>
          <p className="text-slate-500 text-sm mt-1">Review centralized records and past evaluations.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleFilter} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sample ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Collection Point</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Result</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Adulterant</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {MOCK_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{row.point}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      row.result === 'Pure' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {row.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">{row.risk}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.adulterant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedRow(row)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-sm text-slate-500">Showing 7 of 142,592 records</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-300 text-slate-400 rounded hover:text-slate-600 transition-colors text-sm" disabled>Previous</button>
            <button className="px-3 py-1 bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors text-sm">Next</button>
          </div>
        </div>

        {/* Details Modal overlay */}
        {selectedRow && (
          <div className="absolute inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl p-6 transform transition-transform animate-in slide-in-from-right z-10 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900">Sample Details</h3>
              <button onClick={() => setSelectedRow(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">ID</p>
                <p className="font-medium text-slate-900">{selectedRow.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Result</p>
                <p className={`font-medium ${selectedRow.result === 'Pure' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {selectedRow.result}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Telemetry Data</p>
                <div className="mt-1 p-3 bg-slate-50 rounded border border-slate-200 text-sm text-slate-700">
                  {selectedRow.details.split(', ').map(line => <div key={line}>{line}</div>)}
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
