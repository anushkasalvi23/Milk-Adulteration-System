import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Database, Settings, LogOut, ShieldCheck, UserCircle, Menu, X, Activity } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import DataExplorer from './pages/DataExplorer';

function Layout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Platform Overview', icon: LayoutDashboard },
    { path: '/analysis', label: 'Sample Analysis', icon: FlaskConical },
    { path: '/data', label: 'Data Explorer', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white w-64 border-r border-slate-200 transform transition-transform duration-300 ease-in-out z-20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block shadow-sm`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <ShieldCheck className="text-blue-600 w-8 h-8 mr-3" />
          <span className="font-bold text-lg tracking-tight text-slate-900">PureMilk</span>
        </div>
        
        <div className="px-4 py-6 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</div>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}>
                <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-slate-50 rounded-lg border border-slate-100">
            <UserCircle className="text-slate-400 w-8 h-8" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Admin Portal</p>
              <p className="text-xs text-slate-500 truncate">Quality Assurance</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 mr-3 text-slate-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0 shadow-sm">
          <button className="lg:hidden text-slate-600 hover:text-slate-900" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout onLogout={() => setIsAuthenticated(false)}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/data" element={<DataExplorer />} />
      </Routes>
    </Layout>
  );
}

export default App;
