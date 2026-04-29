import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { mockStocks, mockEvents } from './mockData';
import { Stock } from '../types';

interface MarketDataState {
  stocks: Stock[];
  liveEvents: any[];
  marketNews: any[];
}

const MarketDataContext = createContext<MarketDataState>({ stocks: [], liveEvents: [], marketNews: [] });

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [marketNews, setMarketNews] = useState<any[]>([]);

  useEffect(() => {
    // Connect to actual server via websockets
    const socket = io(window.location.origin);

    socket.on('market_update', (data: { stocks: Stock[], triggers: any[] }) => {
      if(data.stocks && data.stocks.length > 0) setStocks(data.stocks);
      if(data.triggers && data.triggers.length > 0) setLiveEvents(data.triggers);
    });

    socket.on('market_news', (news: any[]) => {
      setMarketNews(news);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MarketDataContext.Provider value={{ stocks, liveEvents, marketNews }}>
      {children}
    </MarketDataContext.Provider>
  );
}

export const useMarketData = () => useContext(MarketDataContext);

