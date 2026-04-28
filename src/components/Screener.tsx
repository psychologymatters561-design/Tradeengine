import React, { useState } from 'react';
import { AdvancedRealTimeChart, Screener as TVScreener } from 'react-ts-tradingview-widgets';
import { useMarketData } from '../lib/MarketContext';
import { formatINR, cn, formatVolume } from '../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function Screener() {
  const { stocks } = useMarketData();
  const [selectedStock, setSelectedStock] = useState('BSE:SENSEX'); // Default to Sensex

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100 tracking-tight flex items-center">
            Live Market Overview
             <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                 LIVE
             </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Real-time charts, prices, and screening powered by TradingView Indian market feed.</p>
        </div>
      </div>

      <div className="h-[500px] border border-slate-800 rounded-xl overflow-hidden shadow-xl bg-slate-900/50">
        <AdvancedRealTimeChart 
          theme="dark" 
          symbol={selectedStock} 
          width="100%" 
          height="100%" 
          hide_side_toolbar={false}
          allow_symbol_change={true}
        />
      </div>

      <div className="mt-8 border border-slate-800 rounded-xl overflow-hidden shadow-xl bg-slate-900/50">
         <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
           <h3 className="text-lg font-semibold text-slate-100">Indian Market Screener & Fundamentals</h3>
         </div>
         <div className="h-[600px]">
           {/* @ts-ignore */}
           <TVScreener colorTheme="dark" width="100%" height="100%" defaultColumn="overview" defaultScreen="general" market="india" />
         </div>
      </div>
    </div>
  );
}
