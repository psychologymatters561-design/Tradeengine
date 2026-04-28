import React from 'react';
import { Target, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { useMarketData } from '../lib/MarketContext';
import { Timeline, Screener as TVScreener } from 'react-ts-tradingview-widgets';

export function IntradayDashboard({ onSelectStock }: { onSelectStock: (symbol: string) => void }) {
  const { liveEvents } = useMarketData();
  
  // Filter events to find the most actionable "best" trades
  const topTrades = liveEvents.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center tracking-tight">
          AI Intraday Recommendations <Activity className="w-6 h-6 ml-3 text-indigo-400 animate-pulse" />
        </h2>
        <p className="text-slate-400 mt-2 text-lg">Automatically detecting high-momentum setups with perfect risk-reward.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {topTrades.map(trade => (
          <div key={trade.id} 
               onClick={() => onSelectStock(`NSE:${trade.symbol}`)}
               className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/80 group-hover:bg-indigo-400 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 pl-2">
               <div>
                 <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{trade.symbol}</h3>
                 <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 mt-1.5 inline-block">{trade.type}</span>
               </div>
               <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-md tracking-wide ${trade.impact === 'Positive' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                  {trade.impact === 'Positive' ? <TrendingUp className="w-3 h-3 mr-1.5" /> : <TrendingUp className="w-3 h-3 mr-1.5 transform rotate-180" />}
                  {trade.impact === 'Positive' ? 'BUY ENTRY' : 'SELL ENTRY'}
               </span>
            </div>
            
            <div className="space-y-3 mt-5 pl-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-400">Current Price</span>
                 <span className="font-bold text-slate-200">₹{(trade.price || 0).toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-400 flex items-center"><Target className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Target</span>
                 <span className="font-bold text-emerald-400">₹{(trade.target || 0).toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-400 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> Stop Loss</span>
                 <span className="font-bold text-rose-400">₹{(trade.stopLoss || 0).toFixed(2)}</span>
               </div>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 pl-2 line-clamp-2 leading-relaxed">
              {trade.triggerDetails}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 h-[600px] shadow-xl">
           <div className="p-4 border-b border-slate-800 bg-slate-800/80 flex items-center">
             <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">Market Screener</h3>
           </div>
           <div className="h-[calc(100%-53px)]">
             {/* @ts-ignore */}
             <TVScreener colorTheme="dark" width="100%" height="100%" defaultColumn="overview" defaultScreen="general" market="india" />
           </div>
        </div>
        <div className="lg:col-span-1 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 h-[600px] shadow-xl">
           <div className="p-4 border-b border-slate-800 bg-slate-800/80">
             <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">Live Indian Market News</h3>
           </div>
           <div className="h-[calc(100%-53px)] relative">
             {/* @ts-ignore */}
             <Timeline colorTheme="dark" feedMode="market" market="india" isTransparent displayMode="regular" height="100%" width="100%" />
           </div>
        </div>
      </div>
    </div>
  );
}
