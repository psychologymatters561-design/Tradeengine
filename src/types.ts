export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  sector: string;
  marketCap: number; // in Crores
  peRatio: number;
  trend: ' Bullish ' | ' Bearish ' | ' Neutral ';
}

export interface MarketEvent {
  id: string;
  stockId: string;
  symbol: string;
  date: string;
  headline: string;
  type: 'Result' | 'Bulk Deal' | 'Corporate Action' | 'Management Change' | 'Technical Breakout';
  impact: 'Positive' | 'Negative' | 'Neutral';
  triggerDetails?: string; 
}

export interface SuperstarPortfolio {
  id: string;
  investorName: string;
  netWorth: number; // in Crores
  topHoldings: {
    symbol: string;
    percentageOfPortfolio: number;
    sharesHeld: number;
    changeInStake: 'Increased' | 'Decreased' | 'Unchanged';
  }[];
  latestActivity: string;
}
