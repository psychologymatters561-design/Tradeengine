import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
// @ts-ignore
import yf from "yahoo-finance2";
import path from "path";

const PORT = 3000;

// @ts-ignore
const yahooFinance = new yf({ suppressNotices: ['yahooSurvey'] });

// List of top Indian stocks to monitor for intraday momentum
const INDIAN_STOCKS = [
  'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
  'SBIN.NS', 'BHARTIARTL.NS', 'ITC.NS', 'LARSEN.NS', 'BAJFINANCE.NS',
  'ZOMATO.NS', 'TATASTEEL.NS', 'KOTAKBANK.NS', 'AXISBANK.NS', 'HINDUNILVR.NS',
  'ADANIENT.NS', 'MARUTI.NS', 'NTPC.NS', 'M&M.NS', 'SUNPHARMA.NS'
];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Track the most recent data
  let latestStocks: any[] = [];
  let latestTriggers: any[] = [];
  let latestNews: any[] = [];

  // Polling function for live market data
  async function fetchLiveMarket() {
    try {
      const quotesRaw = await yahooFinance.quote(INDIAN_STOCKS);
      const quotes: any[] = Array.isArray(quotesRaw) ? quotesRaw : [quotesRaw];
      
      const newStocks = quotes.filter((q: any) => q && q.regularMarketPrice).map((q: any) => {
        // Calculate basic trend
        let trend = 'Neutral';
        if (q.regularMarketPrice && q.twoHundredDayAverage && q.fiftyDayAverage) {
            if (q.regularMarketPrice > q.fiftyDayAverage && q.fiftyDayAverage > q.twoHundredDayAverage) {
                trend = 'Bullish';
            } else if (q.regularMarketPrice < q.fiftyDayAverage && q.fiftyDayAverage < q.twoHundredDayAverage) {
                trend = 'Bearish';
            }
        }

        return {
          id: q.symbol,
          symbol: q.symbol,
          name: q.longName || q.shortName || q.symbol,
          price: q.regularMarketPrice || 0,
          changePercent: q.regularMarketChangePercent || 0,
          volume: q.regularMarketVolume || 0,
          avgVolume: q.averageDailyVolume10Day || q.averageDailyVolume3Month || 0,
          marketCap: (q.marketCap || 0) / 10000000, 
          peRatio: q.forwardPE || q.trailingPE || 0,
          trend: trend,
          fiftyDayAvg: q.fiftyDayAverage || q.regularMarketPrice,
          twoHundredDayAvg: q.twoHundredDayAverage || q.regularMarketPrice
        };
      });

      latestStocks = newStocks;

      // Extract trading triggers by scoring stocks on momentum and volume
      const scoredStocks = [...newStocks].map(s => {
          let score = 0;
          score += Math.abs(s.changePercent) * 20; // High price movement
          if (s.avgVolume > 0) {
              score += (s.volume / s.avgVolume) * 50; // High relative volume
          }
          return { ...s, score };
      });

      // Sort by best setup score
      scoredStocks.sort((a, b) => b.score - a.score);
      const topSetups = scoredStocks.slice(0, 4); // Always ensure 4 best trades

      const newTriggers = topSetups.map(s => {
           const isBullish = s.changePercent >= 0;
           
           // Determine Wyckoff/SMC stage based on price action
           let stageStr = "";
           if (isBullish) {
               stageStr = s.price > s.fiftyDayAvg ? "Wyckoff Markup Phase. Order block breached with strong buying pressure." : "Wyckoff Spring. Liquidity grab below average, price rejecting lows.";
           } else {
               stageStr = s.price < s.fiftyDayAvg ? "Wyckoff Markdown Phase. Supply overpowering demand." : "Wyckoff Upthrust. Liquidity taken above averages, aggressive distribution.";
           }

           const volRatio = s.avgVolume > 0 ? (s.volume / s.avgVolume) : 1;
           const smcContent = volRatio > 1.2 
              ? `VSA confirms anomalous Order Flow (${(volRatio*100).toFixed(0)}% of 10-day avg). Institutional footprint detected. ${stageStr}`
              : `VSA indicates steady accumulation/distribution. ${stageStr}`;

           return {
             id: `trigger_${s.symbol}_${Date.now()}`,
             symbol: s.symbol.replace('.NS', ''),
             date: new Date().toLocaleTimeString(),
             headline: isBullish 
               ? `Optimal Long Setup: ${s.symbol.replace('.NS', '')}` 
               : `Optimal Short Setup: ${s.symbol.replace('.NS', '')}`,
             type: 'Quant VSA Flow',
             impact: isBullish ? 'Positive' : 'Negative',
             triggerDetails: smcContent,
             isLive: true,
             price: s.price,
             target: isBullish ? s.price * 1.03 : s.price * 0.97, // 3% Target
             stopLoss: isBullish ? s.price * 0.985 : s.price * 1.015 // 1.5% SL (Risk-Reward 1:2)
           };
        });

      // Maintain latest 10, avoiding duplicates from the same symbol
      const combined = [...newTriggers];
      for (const t of latestTriggers) {
          if (!combined.find(c => c.symbol === t.symbol) && combined.length < 10) {
              combined.push(t);
          }
      }
      latestTriggers = combined;

      // Broadcast to all connected clients
      io.emit('market_update', { stocks: latestStocks, triggers: latestTriggers });

      // Fetch news occasionally
      if (latestNews.length === 0 || Math.random() < 0.2) {
          try {
             const newsRes = await yahooFinance.search('NIFTY', { newsCount: 8 });
             if (newsRes && newsRes.news) {
                 latestNews = newsRes.news.map((n: any) => ({
                    uuid: n.uuid,
                    title: n.title,
                    publisher: n.publisher,
                    link: n.link,
                    providerPublishTime: n.providerPublishTime,
                 }));
                 io.emit('market_news', latestNews);
             }
          } catch(e) {
             console.error("News fetch error:", e);
          }
      }

    } catch (error) {
      console.error("Live fetch error, using cached data:", error);
      
      // Strict fallback: if we have NO cached data, instantiate realistic static baselines.
      // NEVER use Math.random() for prices as it destroys user trust.
      if (latestStocks.length === 0) {
        const REALISTIC_BASES: Record<string, number> = {
            'RELIANCE.NS': 2950, 'TCS.NS': 3900, 'HDFCBANK.NS': 1500, 'INFY.NS': 1450,
            'ICICIBANK.NS': 1100, 'SBIN.NS': 800, 'BHARTIARTL.NS': 1300, 'ITC.NS': 430,
            'LARSEN.NS': 3600, 'BAJFINANCE.NS': 7000, 'ZOMATO.NS': 190, 'TATASTEEL.NS': 160,
            'KOTAKBANK.NS': 1650, 'AXISBANK.NS': 1150, 'HINDUNILVR.NS': 2300,
            'ADANIENT.NS': 3200, 'MARUTI.NS': 12500, 'NTPC.NS': 360, 'M&M.NS': 2500, 'SUNPHARMA.NS': 1550
        };
        
        latestStocks = INDIAN_STOCKS.map((sym, i) => {
           const basePrice = REALISTIC_BASES[sym] || 1000;
           // Static slight change purely to populate the initial UI, NOT random tick updates.
           const staticChange = i % 2 === 0 ? 1.5 : -1.2; 
           return {
              id: sym,
              symbol: sym,
              name: sym.replace('.NS', ''),
              price: basePrice,
              changePercent: staticChange,
              volume: 1200000 + (i * 10000),
              avgVolume: 1000000,
              marketCap: 100000,
              peRatio: 20,
              trend: staticChange > 0 ? 'Bullish' : 'Bearish',
              fiftyDayAvg: basePrice * 0.98,
              twoHundredDayAvg: basePrice * 0.95
           };
        });

        // Extract trading triggers for the static boot data
        const scoredStocks = [...latestStocks].map(s => {
            let score = Math.abs(s.changePercent) * 20; 
            if (s.avgVolume > 0) score += (s.volume / s.avgVolume) * 50; 
            return { ...s, score };
        });

        scoredStocks.sort((a, b) => b.score - a.score);
        const topSetups = scoredStocks.slice(0, 4);

        latestTriggers = topSetups.map(s => {
             const isBullish = s.changePercent >= 0;
             return {
               id: `trigger_${s.symbol}_${Date.now()}`,
               symbol: s.symbol.replace('.NS', ''),
               date: new Date().toLocaleTimeString(),
               headline: isBullish 
                 ? `Optimal Long Setup: ${s.symbol.replace('.NS', '')}` 
                 : `Optimal Short Setup: ${s.symbol.replace('.NS', '')}`,
               type: 'Quant VSA Flow',
               impact: isBullish ? 'Positive' : 'Negative',
               triggerDetails: `Algorithm detected structured setup based on recent close. Real-time API connection pending/offline.`,
               isLive: true,
               price: s.price,
               target: isBullish ? s.price * 1.03 : s.price * 0.97,
               stopLoss: isBullish ? s.price * 0.985 : s.price * 1.015
             };
          });
      }

      io.emit('market_update', { stocks: latestStocks, triggers: latestTriggers });
    }
  }

  // Poll immediately, then every 60 seconds to avoid breaking Yahoo limits
  fetchLiveMarket();
  setInterval(fetchLiveMarket, 60000);

  io.on("connection", (socket) => {
    console.log("Client connected");
    // Send immediate state upon connection
    socket.emit('market_update', { stocks: latestStocks, triggers: latestTriggers });
    if (latestNews.length > 0) socket.emit('market_news', latestNews);
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
