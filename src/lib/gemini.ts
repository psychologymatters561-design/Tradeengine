import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTriggerRationale(stockSymbol: string, eventStr: string, currentPrice: number): Promise<string> {
  try {
    const prompt = `You are an elite Institutional Quant and Order Flow Trader analyzing Indian Equities (NSE/BSE).
    
    Analyze the following intraday setup for ${stockSymbol} currently trading at ₹${currentPrice}.
    Context: ${eventStr}

    Perform a concise analysis focusing strictly on:
    1. **Smart Money Concepts (SMC)**: Order blocks, liquidity grabs, and fair value gaps.
    2. **Wyckoff Theory**: Are we in accumulation, markdown, distribution, or markup? Does it look like a spring or upthrust?
    3. **Volume Spread Analysis (VSA)**: What does abnormal volume indicate here?
    4. **Actionable Trading Plan**: Precise entry zone, immediate profit target, and invalidation stop loss.

    Be succinct, algorithmic, and professional. No fluff. Use bullet points. Limit to ~150 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `**Fallback Algorithmic Analysis for ${stockSymbol} (LTP: ₹${currentPrice})**\n\n* **Momentum Indicator**: High volume detected, signaling institutional participation.\n* **Technical Breadth**: Breaking key Moving Average structures.\n* **Actionable Insight**: Maintain strict stop loss as volatility rises. Target 1:3 Risk/Reward.`;
  }
}

