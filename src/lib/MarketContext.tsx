import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockStocks, mockEvents } from './mockData';
import { Stock } from '../types';

interface MarketDataState {
  stocks: Stock[];
  liveEvents: any[];
}

const MarketDataContext = createContext<MarketDataState>({ stocks: [], liveEvents: [] });

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [liveEvents, setLiveEvents] = useState<any[]>(mockEvents.map(e => {
    const stock = mockStocks.find(s => s.symbol === e.symbol);
    const price = stock ? stock.price : 1000;
    const isBullish = e.impact === 'Positive';
    return {
      ...e,
      isLive: false,
      price,
      target: isBullish ? price * 1.04 : price * 0.97,
      stopLoss: isBullish ? price * 0.985 : price * 1.015
    };
  }));

  useEffect(() => {
    // Highly realistic simulator since we cannot fetch real Yahoo Finance data over CORS on Github Pages
    const interval = setInterval(() => {
      setStocks(currentStocks => 
        currentStocks.map(stock => {
          // Add some volatility
          const shift = (Math.random() - 0.5) * (stock.price * 0.005); // max 0.5% move per tick
          let newPrice = stock.price + shift;
          let newChange = stock.change + shift;
          let newChangePercent = (newChange / (stock.price - stock.change)) * 100;
          
          let trend = stock.trend;
          if (newChangePercent > 1.5) trend = ' Bullish ' as any;
          else if (newChangePercent < -1.5) trend = ' Bearish ' as any;
          else trend = ' Neutral ' as any;

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            volume: stock.volume + Math.floor(Math.random() * 5000), // simulate trades happening
            trend
          };
        })
      );
    }, 2000); // Trigger every 2s to feel very realtime
    
    const triggerInterval = setInterval(() => {
       // Randomly trigger AI events based on the simulated "live" market breadth
       setStocks(currentStocks => {
          const randomIndex = Math.floor(Math.random() * currentStocks.length);
          const activeStock = currentStocks[randomIndex];
          
          if(Math.random() > 0.6) { // 40% chance every 10 seconds to generate a trigger
             const isBullish = Math.random() > 0.5;
             const newEvent = {
                id: `trigger-${Date.now()}`,
                symbol: activeStock.symbol,
                date: new Date().toLocaleTimeString(),
                headline: isBullish ? `Live Breakout Alert: Volume Spike in ${activeStock.symbol}` : `Live Breakdown: Heavy Selling in ${activeStock.symbol}`,
                type: isBullish ? 'Technical Breakout' : 'Technical Breakdown',
                impact: isBullish ? 'Positive' : 'Negative',
                triggerDetails: isBullish 
                  ? `AI algorithms detected aggressive institutional buying. Price crossed VWAP. Volume is 3x standard deviation. Target upside 4% from LTP.`
                  : `Distribution pattern identified. 50-SMA broken with gap-down momentum. Avoid fresh longs. Target downside 3%.`,
                isLive: true,
                price: activeStock.price,
                target: isBullish ? activeStock.price * 1.04 : activeStock.price * 0.97,
                stopLoss: isBullish ? activeStock.price * 0.985 : activeStock.price * 1.015
             };
             
             setLiveEvents(prev => {
                if (prev.find(e => e.symbol === newEvent.symbol && e.isLive)) return prev;
                return [newEvent, ...prev].slice(0, 20); // Maintain latest 20
             });
          }
          return currentStocks;
       });
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(triggerInterval);
    };
  }, []);

  return (
    <MarketDataContext.Provider value={{ stocks, liveEvents }}>
      {children}
    </MarketDataContext.Provider>
  );
}

export const useMarketData = () => useContext(MarketDataContext);
