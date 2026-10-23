import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, ShieldAlert, Droplet, Users, DatabaseZap, CheckCircle2 } from 'lucide-react';

const mlPerformanceData = [
  { name: 'Mon', recall: 0.95, precision: 0.88 },
  { name: 'Tue', recall: 0.96, precision: 0.87 },
  { name: 'Wed', recall: 0.94, precision: 0.89 },
  { name: 'Thu', recall: 0.97, precision: 0.86 },
  { name: 'Fri', recall: 0.96, precision: 0.90 },
  { name: 'Sat', recall: 0.98, precision: 0.91 },
  { name: 'Sun', recall: 0.97, precision: 0.92 },
];

const collectionData = [
  { region: 'North Zone', pure: 45000, adulterated: 3200 },
  { region: 'South Zone', pure: 52000, adulterated: 1800 },
  { region: 'East Zone', pure: 38000, adulterated: 4100 },
  { region: 'West Zone', pure: 61000, adulterated: 950 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time metrics and quality statistics</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-lg p-2">
          <div className="text-xs font-medium text-slate-500 px-2">Pipeline:</div>
          <div className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">XGB-Casc-v2.1</div>
          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Volume Analyzed" value="204.5k L" trend="+12.5%" icon={Droplet} color="blue" />
        <StatCard title="Adulteration Detected" value="10,050 L" trend="-2.4%" icon={ShieldAlert} color="red" />
        <StatCard title="Collection Centers" value="1,248" trend="+18" icon={Users} color="emerald" />
        <StatCard title="Average Latency" value="14.2 ms" trend="-1.1 ms" icon={Activity} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* ML Performance Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <DatabaseZap className="w-5 h-5 text-blue-500" />
              Algorithm Performance (7 Days)
            </h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <LineChart data={mlPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0.8, 1.0]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Legend />
                <Line type="monotone" dataKey="recall" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} name="Recall" />
                <Line type="monotone" dataKey="precision" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} name="Precision" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Volume Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-800">Regional Milk Quality Distribution</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={collectionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="region" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="pure" stackId="a" fill="#10b981" name="Pure Milk (L)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="adulterated" stackId="a" fill="#ef4444" name="Adulterated (L)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  const isPositiveTrend = trend.startsWith('+');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${isPositiveTrend ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend}
        </span>
        <span className="text-slate-500 ml-2">vs last week</span>
      </div>
    </div>
  );
}
