import { Stock, MarketEvent, SuperstarPortfolio } from '../types';

export const mockStocks: Stock[] = [
  { id: '1', symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2950.45, change: 45.20, changePercent: 1.55, volume: 8500200, avgVolume: 7200000, sector: 'Conglomerates', marketCap: 1995000, peRatio: 28.5, trend: ' Bullish ' },
  { id: '2', symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 4120.80, change: -12.40, changePercent: -0.30, volume: 2100400, avgVolume: 2500000, sector: 'IT Services', marketCap: 1480000, peRatio: 31.2, trend: ' Neutral ' },
  { id: '3', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1450.60, change: 25.10, changePercent: 1.76, volume: 15400500, avgVolume: 16000000, sector: 'Banking', marketCap: 1100000, peRatio: 16.4, trend: ' Bullish ' },
  { id: '4', symbol: 'INFY', name: 'Infosys Ltd.', price: 1650.25, change: 30.75, changePercent: 1.90, volume: 5400200, avgVolume: 6100000, sector: 'IT Services', marketCap: 685000, peRatio: 24.1, trend: ' Bullish ' },
  { id: '5', symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1080.95, change: 8.45, changePercent: 0.79, volume: 9200100, avgVolume: 8500000, sector: 'Banking', marketCap: 758000, peRatio: 18.2, trend: ' Bullish ' },
  { id: '6', symbol: 'ITC', name: 'ITC Ltd.', price: 420.30, change: -4.50, changePercent: -1.06, volume: 11200000, avgVolume: 12500000, sector: 'FMCG', marketCap: 520000, peRatio: 26.8, trend: ' Bearish ' },
  { id: '7', symbol: 'L&T', name: 'Larsen & Toubro Ltd.', price: 3650.15, change: 85.00, changePercent: 2.38, volume: 3100500, avgVolume: 2800000, sector: 'Infrastructure', marketCap: 495000, peRatio: 37.5, trend: ' Bullish ' },
  { id: '8', symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 6850.70, change: -120.30, changePercent: -1.73, volume: 1200300, avgVolume: 1500000, sector: 'NBFC', marketCap: 420000, peRatio: 33.1, trend: ' Bearish ' },
  { id: '9', symbol: 'ZOMATO', name: 'Zomato Ltd.', price: 185.40, change: 12.20, changePercent: 7.04, volume: 45000000, avgVolume: 32000000, sector: 'Food Delivery', marketCap: 160000, peRatio: 115.0, trend: ' Bullish ' },
  { id: '10', symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 980.25, change: 15.50, changePercent: 1.61, volume: 8500000, avgVolume: 9200000, sector: 'Automobile', marketCap: 325000, peRatio: 14.5, trend: ' Bullish ' }
];

export const mockEvents: MarketEvent[] = [
  { id: 'e1', stockId: '9', symbol: 'ZOMATO', date: '2026-04-28', headline: 'Management raises EBITDA guidance; strong Q4 expected', type: 'Result', impact: 'Positive', triggerDetails: 'Consistent volume expansion and institutional buying detected.' },
  { id: 'e2', stockId: '7', symbol: 'L&T', date: '2026-04-27', headline: 'Secures "Mega" order worth over ₹10,000 Cr in Middle East', type: 'Corporate Action', impact: 'Positive', triggerDetails: 'Order book visibility improved. MACD crossover on daily charts.' },
  { id: 'e3', stockId: '8', symbol: 'BAJFINANCE', date: '2026-04-28', headline: 'AUM growth slows down; NIMs under pressure', type: 'Result', impact: 'Negative', triggerDetails: 'Moving below 50 DMA, high delivery volume on down days.' },
  { id: 'e4', stockId: '1', symbol: 'RELIANCE', date: '2026-04-26', headline: 'Jio IPO spin-off discussions gaining momentum', type: 'Corporate Action', impact: 'Positive', triggerDetails: 'Value unlocking phase. High call option accumulation at 3000 strike.' },
  { id: 'e5', stockId: '4', symbol: 'INFY', date: '2026-04-28', headline: 'Crosses 200-day DMA with 3x average volume', type: 'Technical Breakout', impact: 'Positive', triggerDetails: 'Classical saucer pattern breakout. Sector rotation into IT.' },
  { id: 'e6', stockId: '3', symbol: 'HDFCBANK', date: '2026-04-25', headline: 'Superstar Investor adds 1.2M shares in bulk deal', type: 'Bulk Deal', impact: 'Positive', triggerDetails: 'Strong institutional absorption. Promoters also buying via open market.' },
];

export const mockPortfolios: SuperstarPortfolio[] = [
  {
    id: 'p1',
    investorName: 'Radhakishan Damani',
    netWorth: 185000,
    latestActivity: 'Added exposure to Cement & Infrastructure',
    topHoldings: [
      { symbol: 'AVENUE', percentageOfPortfolio: 65.5, sharesHeld: 420000000, changeInStake: 'Unchanged' },
      { symbol: 'INDIACEM', percentageOfPortfolio: 5.2, sharesHeld: 15000000, changeInStake: 'Increased' },
      { symbol: 'VSTIND', percentageOfPortfolio: 3.1, sharesHeld: 4500000, changeInStake: 'Unchanged' },
    ]
  },
  {
    id: 'p2',
    investorName: 'Mukul Agrawal',
    netWorth: 4500,
    latestActivity: 'Aggressive entry in Defense & Railways',
    topHoldings: [
      { symbol: 'ZENITH', percentageOfPortfolio: 8.5, sharesHeld: 1200000, changeInStake: 'Increased' },
      { symbol: 'RVNL', percentageOfPortfolio: 6.2, sharesHeld: 5500000, changeInStake: 'Decreased' },
      { symbol: 'BEML', percentageOfPortfolio: 5.8, sharesHeld: 850000, changeInStake: 'Increased' },
    ]
  },
  {
    id: 'p3',
    investorName: 'Ashish Kacholia',
    netWorth: 3200,
    latestActivity: 'Booking profits in Mid-cap IT; buying Specialty Chem',
    topHoldings: [
      { symbol: 'YASHIPAC', percentageOfPortfolio: 7.1, sharesHeld: 2100000, changeInStake: 'Increased' },
      { symbol: 'NIITLTD', percentageOfPortfolio: 4.5, sharesHeld: 1800000, changeInStake: 'Decreased' },
      { symbol: 'BALAMINES', percentageOfPortfolio: 6.8, sharesHeld: 1200000, changeInStake: 'Increased' },
    ]
  }
]
