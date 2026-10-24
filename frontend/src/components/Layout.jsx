import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserButton, useClerk } from '@clerk/clerk-react';
import {
  LayoutDashboard, FlaskConical, Database, LogOut, ShieldCheck, Menu, Search,
  Bell, ChevronsLeft, ChevronsRight, FileText, LifeBuoy, ExternalLink,
} from 'lucide-react';
import { getHealth } from '../api';

const MENU = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analysis', label: 'Sample Analysis', icon: FlaskConical },
  { path: '/data', label: 'Prediction Log', icon: Database },
];

const TITLES = { '/dashboard': 'Dashboard', '/analysis': 'Sample Analysis', '/data': 'Prediction Log' };

export default function Layout({ children }) {
  const { signOut } = useClerk();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [online, setOnline] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let alive = true;
    const check = () =>
      getHealth()
        .then((h) => alive && setOnline(h.status === 'ok' && h.model_loaded))
        .catch(() => alive && setOnline(false));
    check();
    const t = setInterval(check, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const filtered = MENU.filter((m) => m.label.toLowerCase().includes(query.toLowerCase()));
  const link = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
    } ${collapsed ? 'lg:justify-center' : ''}`;

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      <div className="w-full h-screen bg-[#f5f5f5] flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 bg-[#f5f5f5] flex flex-col p-3 transition-all duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${collapsed ? 'lg:w-[72px]' : 'lg:w-64'} w-64`}>
          <div className={`flex items-center h-12 px-2 ${collapsed ? 'lg:justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2 font-semibold text-lg text-slate-900">
              <ShieldCheck className="w-7 h-7 text-slate-900" />
              {!collapsed && 'PureMilk'}
            </div>
            {!collapsed && (
              <button onClick={() => setCollapsed(true)} className="hidden lg:block text-slate-400 hover:text-slate-700" aria-label="Collapse sidebar">
                <ChevronsLeft className="w-4 h-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="hidden lg:flex justify-center text-slate-400 hover:text-slate-700 mb-2" aria-label="Expand sidebar">
              <ChevronsRight className="w-4 h-4" />
            </button>
          )}

          {!collapsed && (
            <div className="relative mt-2 mb-5">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-200/70 text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          )}

          {!collapsed && <p className="px-3 mb-2 text-sm text-slate-500">Menu</p>}
          <nav className="space-y-1">
            {filtered.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} onClick={() => setOpen(false)} className={link} title={label}>
                <Icon className="w-[18px] h-[18px] text-slate-500 shrink-0" />
                {!collapsed && label}
              </NavLink>
            ))}
            {!filtered.length && <p className="px-3 text-xs text-slate-400">No matches</p>}
          </nav>

          <div className="mt-auto space-y-1">
            <a href="/docs" target="_blank" rel="noreferrer" className={link({ isActive: false })} title="API Docs">
              <FileText className="w-[18px] h-[18px] text-slate-500 shrink-0" />
              {!collapsed && <>API Docs <ExternalLink className="w-3 h-3 ml-auto text-slate-400" /></>}
            </a>
            <a href="https://github.com/ommadav/Indian-Milk-Adulteration-Detection-Dataset" target="_blank" rel="noreferrer" className={link({ isActive: false })} title="Dataset">
              <LifeBuoy className="w-[18px] h-[18px] text-slate-500 shrink-0" />
              {!collapsed && <>Dataset <ExternalLink className="w-3 h-3 ml-auto text-slate-400" /></>}
            </a>
            <button onClick={() => signOut({ redirectUrl: '/' })} className={`w-full ${link({ isActive: false })} hover:!text-red-600`} title="Sign out">
              <LogOut className="w-[18px] h-[18px] text-slate-500 shrink-0" />
              {!collapsed && 'Sign out'}
            </button>
          </div>
        </aside>

        {open && <div className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden" onClick={() => setOpen(false)} />}

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-slate-600" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="w-6 h-6" /></button>
              <h1 className="text-lg font-semibold text-slate-900">{TITLES[location.pathname] || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className={`hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${online ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : online === false ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <span className={`h-2 w-2 rounded-full ${online ? 'bg-emerald-500' : online === false ? 'bg-red-500' : 'bg-slate-400'}`} />
                {online ? 'API Online' : online === false ? 'API Offline' : 'Checking...'}
              </span>
              <span className="relative text-slate-600" title="Notifications">
                <Bell className="w-5 h-5" />
                {online === false && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />}
              </span>
              <UserButton />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-white lg:rounded-tl-3xl border-t border-l border-slate-200/70 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
