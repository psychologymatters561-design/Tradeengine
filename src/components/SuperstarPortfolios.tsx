import React from 'react';
import { mockPortfolios } from '../lib/mockData';
import { Briefcase, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatINR } from '../lib/utils';

export function SuperstarPortfolios() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100 tracking-tight">Superstar Portfolios</h2>
          <p className="text-sm text-slate-400 mt-1">Track what the "big whales" and marquee investors are buying or selling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockPortfolios.map((portfolio) => (
          <div key={portfolio.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Briefcase className="w-24 h-24 text-slate-100" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-slate-100">{portfolio.investorName}</h3>
              <p className="text-2xl font-bold text-emerald-400 mt-2 tracking-tight">
                {formatINR(portfolio.netWorth)} <span className="text-xs font-normal text-slate-400 uppercase tracking-wider">Cr. Net Worth</span>
              </p>
              
              <div className="mt-6">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Recent Activity</div>
                <p className="text-sm text-indigo-300 font-medium leading-relaxed bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                  {portfolio.latestActivity}
                </p>
              </div>

              <div className="mt-6">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Top Holdings</div>
                <ul className="space-y-3">
                  {portfolio.topHoldings.map((holding, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <span className="font-semibold text-slate-200 w-24">{holding.symbol}</span>
                        <span className="text-slate-500 text-xs">{holding.percentageOfPortfolio}% of PF</span>
                      </div>
                      <div>
                        {holding.changeInStake === 'Increased' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                        {holding.changeInStake === 'Decreased' && <TrendingDown className="w-4 h-4 text-rose-400" />}
                        {holding.changeInStake === 'Unchanged' && <Minus className="w-4 h-4 text-slate-500" />}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
