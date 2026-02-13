
import { GoogleGenAI } from "@google/genai";
import { TrustScore } from "../types";

export interface AiResponse {
  text: string;
  sources: { title: string; url: string }[];
}

const extractSources = (response: any) => {
  // Extract web grounding chunks safely
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = chunks
    .filter((chunk: any) => chunk.web && chunk.web.uri)
    .map((chunk: any) => ({
      title: chunk.web.title || "Reference",
      url: chunk.web.uri
    }));
    
  // Filter unique URLs
  return Array.from(new Map(sources.map((s: any) => [s.url, s])).values()) as { title: string; url: string }[];
};

export const getUbuntuWisdom = async (score: TrustScore, name: string): Promise<AiResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an Ubuntu Community Advisor, analyze this member's Trust DNA and provide a short (2 sentence) encouragement and risk tip. 
      Contextualize your answer with the current South African economic climate (ZAR performance, inflation, or interest rates).
      Name: ${name}
      Score: ${score.score}
      Metrics: Velocity: ${score.metrics.contributionVelocity}, Vouching: ${score.metrics.communityVouching}.
      Tone: Humanistic, professional but warm.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    
    return { 
      text: response.text || "Your commitment is the foundation of our shared prosperity.", 
      sources: extractSources(response) 
    };
  } catch (error) {
    console.error("Gemini Wisdom Error:", error);
    return { text: "Your commitment is our shared strength. Keep the fire burning.", sources: [] };
  }
};

export const generateMediationAdvice = async (memberName: string, daysLate: number, amount: number): Promise<AiResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `A member named ${memberName} is ${daysLate} days late on an Ubuntu Pool contribution of R ${amount}. 
      As an Ubuntu Mediator, draft a "Nudge of Restoration" that is firm but compassionate. 
      Reference the philosophy that "a person is a person through others" and suggest a payment plan or a call for community support if they are facing hardship.
      Tone: Respectful, community-focused, firm but empathetic. Avoid aggressive legal jargon.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return { text: response.text || "Drafting mediation strategy...", sources: extractSources(response) };
  } catch (error) {
    return { text: "Failed to generate mediation advice.", sources: [] };
  }
};

export const generateWholesaleProposal = async (poolName: string, totalValue: number, memberCount: number, partner: string): Promise<AiResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft a professional 'Wholesale Bulk-Buying Strategic Partnership Proposal' from ${poolName} to ${partner}.
      Aggregated Buying Power: R ${totalValue.toLocaleString()}. Businesses: ${memberCount}.
      Request a 12-18% discount. Suggest 2% platform commission.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return { text: response.text || "Proposal could not be generated.", sources: extractSources(response) };
  } catch (error) {
    return { text: "Failed to generate proposal.", sources: [] };
  }
};
