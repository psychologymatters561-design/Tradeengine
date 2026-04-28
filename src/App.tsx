import React, { useState } from 'react';
import { Search, Brain } from 'lucide-react';
import { IntradayDashboard } from './components/IntradayDashboard';
import { StockDetail } from './components/StockDetail';

export default function App() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      let symbol = searchInput.trim().toUpperCase();
      // Ensure we hit Indian Market on TradingView
      if (!symbol.includes(':')) {
         symbol = `NSE:${symbol}`;
      }
      setSelectedSymbol(symbol);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Top Header */}
      <header className="h-16 px-6 lg:px-8 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 w-full shadow-sm">
        <div className="flex items-center text-slate-100 cursor-pointer group" onClick={() => setSelectedSymbol(null)}>
          <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20 mr-3 group-hover:bg-indigo-500/20 transition-colors">
             <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            TradeEngine AI
          </span>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 lg:mx-12 relative group hidden sm:block">
           <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
           <input 
             type="text" 
             value={searchInput}
             onChange={(e) => setSearchInput(e.target.value)}
             placeholder="Search any stock (e.g. RELIANCE, TCS)..." 
             className="w-full bg-slate-950/50 border border-slate-700/80 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500 shadow-inner"
           />
        </form>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-xs font-bold tracking-wide px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            AI ACTIVE
          </div>
        </div>
      </header>
      
      {/* Search on mobile */}
      <div className="sm:hidden px-4 py-3 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md sticky top-16 z-10">
        <form onSubmit={handleSearch} className="relative group">
           <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
           <input 
             type="text" 
             value={searchInput}
             onChange={(e) => setSearchInput(e.target.value)}
             placeholder="Search any stock..." 
             className="w-full bg-slate-950/80 border border-slate-700/80 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
           />
        </form>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedSymbol ? (
          <StockDetail symbol={selectedSymbol} onBack={() => setSelectedSymbol(null)} />
        ) : (
          <IntradayDashboard onSelectStock={(s) => setSelectedSymbol(s)} />
        )}
      </main>
    </div>
  );
}
