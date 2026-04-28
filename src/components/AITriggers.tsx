import React, { useState } from 'react';
import { generateTriggerRationale } from '../lib/gemini';
import { Sparkles, ArrowRight, Activity, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useMarketData } from '../lib/MarketContext';
import { Timeline } from 'react-ts-tradingview-widgets';

export function AITriggers() {
  const { liveEvents: events, stocks } = useMarketData();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rationaleMap, setRationaleMap] = useState<Record<string, { loading: boolean, text: string }>>({});

  const handleGenerateRationale = async (eventId: string, symbol: string, eventHeadline: string, isLive?: boolean, eventObj?: any) => {
    setSelectedEventId(eventId);
    
    // If already generated or loading, just show/expand and don't re-fetch immediately unless desired
    if (rationaleMap[eventId] && !rationaleMap[eventId].loading) {
      return; 
    }

    setRationaleMap(prev => ({
      ...prev,
      [eventId]: { loading: true, text: '' }
    }));

    let currentPrice = eventObj?.price || 1000;
    if (!isLive) {
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock) currentPrice = stock.price;
    }

    const rationale = await generateTriggerRationale(symbol, eventHeadline, currentPrice);

    setRationaleMap(prev => ({
      ...prev,
      [eventId]: { loading: false, text: rationale }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
         <div>
          <h2 className="text-2xl font-semibold text-slate-100 tracking-tight flex items-center">
            AI Event Triggers & Live News <Sparkles className="w-5 h-5 ml-2 text-indigo-400" />
            <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                 LISTENING
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Real-time Indian market news feed and AI-monitored technical alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: TradingView Live News */}
        <div className="xl:col-span-1 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 h-[800px]">
           <div className="p-4 border-b border-slate-800 bg-slate-800/50">
             <h3 className="text-sm font-semibold text-slate-100">Live Indian Market News</h3>
           </div>
           <div className="h-[calc(100%-53px)]">
             {/* @ts-ignore */}
             <Timeline colorTheme="dark" feedMode="market" market="india" isTransparent displayMode="regular" height="100%" width="100%" />
           </div>
        </div>

        {/* Right Col: AI Triggers */}
        <div className="xl:col-span-2 space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          {events.map(event => {
            const rationaleInfo = rationaleMap[event.id];
            const isSelected = selectedEventId === event.id;

            return (
              <div key={event.id} className={cn(
                 "bg-slate-900 border transition-all duration-300 rounded-xl p-5 relative overflow-hidden",
                 event.isLive ? "border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] bg-slate-800/40" : "border-slate-800 hover:border-slate-700"
              )}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-slate-800 p-2 rounded-lg">
                      <Activity className={cn("w-5 h-5", event.isLive ? "text-indigo-400" : "text-emerald-400")} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 flex items-center">
                         {event.symbol}
                         {event.isLive && <span className="ml-2 text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-sm border border-rose-500/30">REAL-TIME</span>}
                      </h3>
                      <div className="flex items-center text-xs text-slate-400 mt-0.5 space-x-2">
                         <span>{event.date}</span>
                         <span>•</span>
                         <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{event.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                     {event.impact === 'Positive' && <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> Bullish</span>}
                     {event.impact === 'Negative' && <span className="flex items-center text-xs font-semibold text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full"><TrendingDown className="w-3 h-3 mr-1" /> Bearish</span>}
                  </div>
                </div>

                <div className="my-4">
                  <p className="text-sm font-medium text-slate-200 leading-snug">{event.headline}</p>
                  <p className="text-xs text-slate-400 mt-2 flex items-start">
                    <ArrowRight className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                    {event.triggerDetails}
                  </p>
                  
                  {event.isLive && (
                    <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-950/50 p-2 rounded border border-slate-800">
                       <div className="text-xs text-slate-400">Target: <span className="font-semibold text-emerald-400">₹{event.target?.toFixed(2)}</span></div>
                       <div className="text-xs text-slate-400">Stop Loss: <span className="font-semibold text-rose-400">₹{event.stopLoss?.toFixed(2)}</span></div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  {!rationaleInfo ? (
                    <button 
                      onClick={() => handleGenerateRationale(event.id, event.symbol, event.headline, event.isLive, event)}
                      className="w-full flex justify-center items-center py-2 px-4 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium transition-colors group"
                    >
                      <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Generate AI Prediction Rationale
                    </button>
                  ) : (
                    <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1.5" /> AI Rationale
                      </h4>
                      {rationaleInfo.loading ? (
                        <div className="flex items-center text-slate-400 text-sm py-2">
                          <RefreshCcw className="w-4 h-4 mr-2 animate-spin text-indigo-400" />
                          Analyzing historical models...
                        </div>
                      ) : (
                        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                           {rationaleInfo.text}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
