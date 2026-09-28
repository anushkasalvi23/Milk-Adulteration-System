import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 inline-block mb-4">
            <ShieldCheck className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PureMilk</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Quality Assurance Platform
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Welcome Back</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    required
                    defaultValue="admin"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    required
                    defaultValue="********"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 transition-all disabled:opacity-70 mt-6"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-xs text-slate-500 text-center">
            Secured by Adulteration Detection System
          </div>
        </div>
      </div>
    </div>
  );
}
