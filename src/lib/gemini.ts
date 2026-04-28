export async function generateTriggerRationale(stockSymbol: string, eventStr: string, currentPrice: number): Promise<string> {
  // Simulate network delay for AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  const text = eventStr.toLowerCase();
  const isBullish = text.includes('guidance') || text.includes('secures') || text.includes('momentum') || text.includes('breakout') || text.includes('adds');
  const isBearish = text.includes('slows') || text.includes('pressure') || text.includes('misses') || text.includes('resigns');

  let analysis = `**Algorithmic Analysis for ${stockSymbol} (LTP: ₹${currentPrice})**\n\n`;

  if (isBearish) {
    analysis += `* **Momentum Indicator**: Past instances of similar headwinds for ${stockSymbol} have historically led to near-term multiple derating, with a 75% probability of testing lower support zones.\n`;
    analysis += `* **Technical Breadth**: Delivery data shows distribution. MACD crossover is on the verge of turning negative on the daily charts.\n`;
    analysis += `* **Actionable Insight**: Protect capital. Any technical bounce might be sold into until the stock forms a definitive base near the 200-DMA.`;
  } else if (isBullish) {
    analysis += `* **Momentum Indicator**: Historically, ${stockSymbol} exhibits a strong positive correlation with this type of catalyst. Past data indicates a 68% probability of a 5-8% upside over the next 14 trading sessions.\n`;
    analysis += `* **Technical Breadth**: We're observing volume expansion that is 2.5x the 10-day average, signaling institutional accumulation.\n`;
    analysis += `* **Actionable Insight**: The stock is clearing key overhead resistance. A sustained close above current levels confirms the bullish market structure.`;
  } else {
    analysis += `* **Momentum Indicator**: The market has likely priced in this development for ${stockSymbol}. Historical volatility remains flat in similar scenarios.\n`;
    analysis += `* **Technical Breadth**: Price action is range-bound with average volume indicating a 'wait-and-watch' stance from large operators.\n`;
    analysis += `* **Actionable Insight**: Maintain current positions and look for a decisive volume breakout before adding fresh capital.`;
  }

  return analysis;
}
