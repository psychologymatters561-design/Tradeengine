import React from 'react';
import { Target, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { useMarketData } from '../lib/MarketContext';
import { Timeline, Screener as TVScreener, MiniChart } from 'react-ts-tradingview-widgets';

export function IntradayDashboard({ onSelectStock }: { onSelectStock: (symbol: string) => void }) {
  const { liveEvents, stocks, marketNews } = useMarketData();
  
  // Filter events to find the most actionable "best" trades
  const topTrades = liveEvents.slice(0, 4);
  const bestStocks = [...stocks].filter(s => s.volume > 0).sort((a,b) => b.changePercent - a.changePercent).slice(0, 10);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center tracking-tight">
          AI Intraday Recommendations <Activity className="w-6 h-6 ml-3 text-indigo-400 animate-pulse" />
        </h2>
        <p className="text-slate-400 mt-2 text-lg">Automatically detecting high-momentum setups with perfect risk-reward.</p>
      </div>

      {topTrades.length === 0 ? (
         <div className="h-64 flex flex-col items-center justify-center border border-slate-800 rounded-xl bg-slate-900/50">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Scanning Indian Markets for optimal setups...</p>
         </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {topTrades.map(trade => (
          <div key={trade.id} 
               onClick={() => onSelectStock(`NSE:${trade.symbol}`)}
               className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] group relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/80 group-hover:bg-indigo-400 transition-colors"></div>
            <div className="flex justify-between items-start mb-2 pl-2">
               <div>
                 <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{trade.symbol}</h3>
                 <div className="flex flex-wrap gap-2 mt-2">
                   <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">Volume Analysis</span>
                   {trade.impact === 'Positive' ? (
                     <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">Long Setup</span>
                   ) : (
                     <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400">Short Setup</span>
                   )}
                 </div>
               </div>
               <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-md tracking-wide ${trade.impact === 'Positive' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                  {trade.impact === 'Positive' ? <TrendingUp className="w-3 h-3 mr-1.5" /> : <TrendingUp className="w-3 h-3 mr-1.5 transform rotate-180" />}
                  {trade.impact === 'Positive' ? 'BUY' : 'SELL'}
               </span>
            </div>
            
            {/* Removed MiniChart to avoid script errors */}
            
            <div className="space-y-3 mt-2 pl-2 bg-slate-950/50 p-4 rounded-lg border border-slate-800/80 shadow-inner">
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-400 font-medium">Setup Base Level</span>
                 <span className="font-mono text-slate-300">₹{(trade.price || 0).toFixed(2)}</span>
               </div>
               <hr className="border-slate-800" />
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-400 flex items-center"><Target className="w-4 h-4 mr-1.5 text-emerald-500" /> Target Price</span>
                 <span className="font-mono font-bold text-emerald-400">₹{(trade.target || 0).toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-400 flex items-center"><AlertTriangle className="w-4 h-4 mr-1.5 text-rose-500" /> Invalidates at</span>
                 <span className="font-mono font-bold text-rose-400">₹{(trade.stopLoss || 0).toFixed(2)}</span>
               </div>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 pl-2 font-medium leading-relaxed bg-slate-800/50 p-3 rounded flex-1">
              {trade.triggerDetails}
            </p>
          </div>
        ))}
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 h-[600px] shadow-xl flex flex-col">
           <div className="p-4 border-b border-slate-800 bg-slate-800/80 flex items-center shrink-0">
             <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">Top Indian Market Movers</h3>
           </div>
           <div className="flex-1 overflow-auto p-4 custom-scrollbar">
             <div className="space-y-2">
               {bestStocks.map((stock) => (
                 <div key={stock.id} onClick={() => onSelectStock(`NSE:${stock.symbol.replace('.NS', '')}`)} className="bg-slate-800/40 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-800 transition">
                    <div className="flex flex-col">
                       <span className="text-slate-200 font-bold">{stock.name}</span>
                       <span className="text-slate-500 text-xs">{stock.symbol}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-slate-200 font-mono">₹{stock.price.toFixed(2)}</span>
                       <span className={`text-sm font-medium ${stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                         {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                       </span>
                    </div>
                 </div>
               ))}
               {bestStocks.length === 0 && <span className="text-slate-500 block text-center mt-10">Waiting for live data...</span>}
             </div>
           </div>
        </div>
        <div className="lg:col-span-1 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 h-[600px] shadow-xl flex flex-col">
           <div className="p-4 border-b border-slate-800 bg-slate-800/80 shrink-0">
             <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">Live Indian Market News</h3>
           </div>
           <div className="flex-1 relative overflow-auto custom-scrollbar p-4 space-y-4">
               {marketNews.length > 0 ? marketNews.map(news => (
                  <a key={news.uuid} href={news.link} target="_blank" rel="noopener noreferrer" className="block bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 rounded-lg p-4 transition-colors">
                     <span className="text-xs text-indigo-400 font-medium mb-1 block">{(new Date(news.providerPublishTime)).toLocaleTimeString()} • {news.publisher}</span>
                     <h4 className="text-slate-200 font-medium leading-snug">{news.title}</h4>
                  </a>
               )) : (
                  <div className="text-slate-500 flex flex-col items-center justify-center mt-10 space-y-4">
                     <div className="w-6 h-6 border-2 border-slate-500/30 border-t-slate-500 rounded-full animate-spin"></div>
                     <span>Fetching latest news...</span>
                  </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
}
