import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, Briefcase, BellRing, Settings, Search, Menu } from 'lucide-react';
import { cn } from './lib/utils';
import { Screener } from './components/Screener';
import { SuperstarPortfolios } from './components/SuperstarPortfolios';
import { AITriggers } from './components/AITriggers';

type Tab = 'screener' | 'ai-triggers' | 'superstars';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('screener');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 sticky top-0 md:h-screen z-20">
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-100 flex items-center tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center mr-3 shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            NiftyPulse <span className="text-indigo-400 ml-1">AI</span>
          </h1>
        </div>

        <nav className="px-4 space-y-1">
          <button 
            onClick={() => setActiveTab('screener')}
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 font-medium",
              activeTab === 'screener' 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Screeners & Live
          </button>
          
          <button 
            onClick={() => setActiveTab('ai-triggers')}
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 font-medium",
              activeTab === 'ai-triggers' 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            <BellRing className="w-5 h-5 mr-3" />
            AI Triggers & News
          </button>

          <button 
            onClick={() => setActiveTab('superstars')}
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200 font-medium",
              activeTab === 'superstars' 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            <Briefcase className="w-5 h-5 mr-3" />
            Superstar Portfolios
          </button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Data simulated. Real-time connections require an active API key.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 w-full">
          <div className="flex items-center text-slate-400">
            <Menu className="w-5 h-5 md:hidden mr-4 cursor-pointer" />
            <div className="hidden md:flex items-center space-x-2 text-sm font-medium">
              <span>Nifty 50</span>
              <span className="text-emerald-400">22,350.40</span>
              <span className="text-emerald-400/80 text-xs bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">+1.2%</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="relative group hidden sm:block">
               <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search NSE/BSE stocks..." 
                 className="bg-slate-950 border border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all w-64"
               />
             </div>
             <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
               <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'screener' && <Screener />}
            {activeTab === 'ai-triggers' && <AITriggers />}
            {activeTab === 'superstars' && <SuperstarPortfolios />}
          </div>
        </div>
      </main>
    </div>
  );
}
