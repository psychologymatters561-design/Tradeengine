import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { mockStocks } from '../lib/mockData';
import { formatINR, formatVolume, cn } from '../lib/utils';
import { Stock } from '../types';

export function Screener() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100 tracking-tight">Market Screener</h2>
          <p className="text-sm text-slate-400 mt-1">Live tracking of active Indian equities based on volume, trend, and fundamentals.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-slate-800 border border-slate-700 text-sm rounded-md hover:bg-slate-700 text-slate-200 transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 bg-emerald-600/90 text-white text-sm font-medium rounded-md hover:bg-emerald-600 transition-colors shadow-sm">
            Save Screen
          </button>
        </div>
      </div>

      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-medium uppercase tracking-wider text-xs border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4 text-right">LTP (₹)</th>
                <th className="px-6 py-4 text-right">Change %</th>
                <th className="px-6 py-4 text-right">Volume</th>
                <th className="px-6 py-4 text-right">M-Cap (Cr)</th>
                <th className="px-6 py-4 text-right">P/E</th>
                <th className="px-6 py-4 text-center">Trend Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockStocks.map((stock: Stock) => (
                <tr key={stock.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-100">{stock.symbol}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{stock.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-200">
                    {formatINR(stock.price)}
                  </td>
                  <td className={cn(
                    "px-6 py-4 whitespace-nowrap text-right font-medium",
                    stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-slate-300">
                    {formatVolume(stock.volume)}
                    {stock.volume > stock.avgVolume * 2 && (
                       <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" title="High Volume Spike">H</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-slate-300">
                    {formatVolume(stock.marketCap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-slate-300">
                    {stock.peRatio.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center">
                      {stock.trend.trim() === 'Bullish' && <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]"><TrendingUp className="w-3 h-3 mr-1" /> Bullish</span>}
                      {stock.trend.trim() === 'Bearish' && <span className="flex items-center text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full text-xs border border-rose-400/20"><TrendingDown className="w-3 h-3 mr-1" /> Bearish</span>}
                      {stock.trend.trim() === 'Neutral' && <span className="flex items-center text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full text-xs border border-slate-700"><Minus className="w-3 h-3 mr-1" /> Neutral</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
