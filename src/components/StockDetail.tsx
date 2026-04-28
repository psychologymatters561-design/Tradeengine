import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, AlertTriangle, Zap } from 'lucide-react';
import { AdvancedRealTimeChart, Timeline, SymbolInfo, FundamentalData, CompanyProfile } from 'react-ts-tradingview-widgets';
import { generateTriggerRationale } from '../lib/gemini';

export function StockDetail({ symbol, onBack }: { symbol: string, onBack: () => void }) {
  const [aiRationale, setAiRationale] = useState<{ loading: boolean, text: string }>({ loading: true, text: '' });

  useEffect(() => {
    // Generate AI rationale whenever symbol changes
    const fetchRationale = async () => {
      setAiRationale({ loading: true, text: '' });
      try {
         const rationale = await generateTriggerRationale(symbol.replace('NSE:', '').replace('BSE:', ''), 'Intraday Setup Analysis', 0);
         setAiRationale({ loading: false, text: rationale });
      } catch (e) {
         setAiRationale({ loading: false, text: 'AI Analysis temporarily unavailable.' });
      }
    };
    fetchRationale();
  }, [symbol]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <button 
        onClick={onBack} 
        className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-900/50 hover:bg-slate-800 px-4 py-2 rounded-full border border-slate-800 w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to AI Dashboard
      </button>

      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/80 shadow-xl p-1">
         <SymbolInfo symbol={symbol} colorTheme="dark" isTransparent width="100%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="h-[600px] border border-slate-800 rounded-xl overflow-hidden shadow-xl bg-slate-900/50">
            <AdvancedRealTimeChart 
              theme="dark" 
              symbol={symbol} 
              width="100%" 
              height="100%" 
              hide_side_toolbar={false}
              allow_symbol_change={false}
              interval="15"
              timezone="Asia/Kolkata"
            />
          </div>
          
          <div className="border border-slate-800 rounded-xl overflow-hidden shadow-xl bg-slate-900/50 flex-1 min-h-[300px]">
             {/* @ts-ignore */}
             <FundamentalData symbol={symbol} colorTheme="dark" width="100%" height="100%" isTransparent displayMode="regular" />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6 flex flex-col">
          {/* AI Trading Plan */}
          <div className="border border-indigo-500/30 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(99,102,241,0.15)] bg-[#0a0f25] p-6 relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-cyan-400"></div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center mb-5 tracking-tight">
               <Zap className="w-5 h-5 mr-2 text-indigo-400" fill="currentColor" />
               AI Intraday Blueprint
            </h3>
            <div className="space-y-5">
              <div className="text-sm text-slate-300 leading-relaxed font-medium">
                {aiRationale.loading ? (
                   <span className="flex items-center text-slate-400 animate-pulse"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span> Analyzing live momentum & volume profile...</span>
                ) : (
                   <div className="whitespace-pre-wrap">{aiRationale.text.substring(0, 300)}...</div>
                )}
              </div>
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800/80 shadow-inner space-y-3">
                 <div className="flex justify-between text-sm items-center">
                   <span className="text-slate-400 font-medium">Entry Strategy</span>
                   <span className="font-bold text-indigo-400">Market Price</span>
                 </div>
                 <hr className="border-slate-800" />
                 <div className="flex justify-between text-sm items-center">
                   <span className="text-slate-400 flex items-center font-medium"><Target className="w-4 h-4 mr-1.5 text-emerald-500" /> Target</span>
                   <span className="font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded">+2.5%</span>
                 </div>
                 <hr className="border-slate-800" />
                 <div className="flex justify-between text-sm items-center">
                   <span className="text-slate-400 flex items-center font-medium"><AlertTriangle className="w-4 h-4 mr-1.5 text-rose-500" /> Stop Loss</span>
                   <span className="font-bold text-rose-400 border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded">-1.0%</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden shadow-xl bg-slate-900/50 flex-1 min-h-[400px]">
            <div className="p-4 border-b border-slate-800 bg-slate-800/80">
               <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">Stock News & Alerts</h3>
            </div>
            <div className="h-[calc(100%-53px)]">
               {/* @ts-ignore */}
               <Timeline colorTheme="dark" feedMode="symbol" symbol={symbol} isTransparent displayMode="regular" height="100%" width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
