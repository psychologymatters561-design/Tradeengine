import { GoogleGenAI } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTriggerRationale(stockSymbol: string, eventStr: string, currentPrice: number): Promise<string> {
  const prompt = `You are an expert Indian stock market technical and fundamental analyst, similar to Trendlyne's algorithms. 
Analyze the following event for the stock ${stockSymbol}.

Current Price: ₹${currentPrice}
Event / News: "${eventStr}"

Provide a concise, professional "Rationale" on why this stock might go up or down based on past historical records of similar events. 
Do not give financial advice. Give it as a data-driven prediction rationale. Use bullet points if necessary. Limit to 100-150 words.
Make it sound highly analytical. Mention concepts like volume breakouts, moving averages, institutional buying, or earnings surprise if relevant.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating analysis. Please try again.";
  }
}
