// Gemini API Client for Cook Healthy AI - Enhanced Error Handling

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize Gemini client
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
let textModel: GenerativeModel | null = null;
let visionModel: GenerativeModel | null = null;
let apiKeyValid: boolean | null = null;

// Check if API key looks valid (not a placeholder)
function isValidApiKey(key: string): boolean {
  return !!key && 
    key.length > 20 && 
    key !== 'your_gemini_api_key_here' &&
    key !== 'your_api_key_here' &&
    key.startsWith('AIza');
}

// Initialize models
export function initializeGemini(apiKey?: string): boolean {
  const key = apiKey || API_KEY;
  
  if (!isValidApiKey(key)) {
    console.warn('Gemini API key not valid. Using mock data.');
    apiKeyValid = false;
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(key);
    textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    visionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    apiKeyValid = true;
    console.log('Gemini initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini:', error);
    apiKeyValid = false;
    return false;
  }
}

// Get text model
export function getTextModel(): GenerativeModel | null {
  if (!textModel && isValidApiKey(API_KEY)) {
    initializeGemini();
  }
  return textModel;
}

// Get vision model
export function getVisionModel(): GenerativeModel | null {
  if (!visionModel && isValidApiKey(API_KEY)) {
    initializeGemini();
  }
  return visionModel;
}

// Check if Gemini is available
export function isGeminiAvailable(): boolean {
  if (apiKeyValid === null) {
    // First time check - try to initialize
    initializeGemini();
  }
  return apiKeyValid === true && textModel !== null;
}

// Delay utility for retry logic
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate content with retry logic
export async function generateContent(
  prompt: string,
  maxRetries: number = 2
): Promise<string | null> {
  // Try to get or initialize model
  let model = getTextModel();
  
  if (!model) {
    console.warn('Gemini not available, returning null');
    return null;
  }
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (text) {
        return text;
      }
    } catch (error: any) {
      console.error(`Gemini attempt ${i + 1} failed:`, error?.message || error);
      
      // Check for API key errors
      if (error?.message?.includes('API key') || 
          error?.message?.includes('INVALID_ARGUMENT') ||
          error?.message?.includes('expired')) {
        console.error('API key issue detected. Please renew your Gemini API key.');
        apiKeyValid = false;
        return null;
      }
      
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1)); // Linear backoff
      }
    }
  }
  
  return null;
}

// Generate content with image for vision tasks
export async function generateContentWithImage(
  prompt: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  maxRetries: number = 2
): Promise<string | null> {
  const model = getVisionModel();
  
  if (!model) {
    console.warn('Gemini Vision not available, returning null');
    return null;
  }
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
      ]);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error(`Gemini Vision attempt ${i + 1} failed:`, error?.message || error);
      
      // Check for API key errors
      if (error?.message?.includes('API key') || 
          error?.message?.includes('INVALID_ARGUMENT') ||
          error?.message?.includes('expired')) {
        apiKeyValid = false;
        return null;
      }
      
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  
  return null;
}

// Parse JSON response from Gemini
export function parseGeminiJSON<T>(response: string): T | null {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]) as T;
    }
    // Try to find JSON object
    const objectMatch = response.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]) as T;
    }
    // Try direct JSON parse
    return JSON.parse(response) as T;
  } catch {
    console.error('Failed to parse Gemini JSON response');
    return null;
  }
}

// Export API key check for components
export function hasValidApiKey(): boolean {
  return isValidApiKey(API_KEY);
}
