
import { GoogleGenAI, Type } from "@google/genai";

// Helper to get a fresh client instance
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY' });
};

export const generateCreativePrompt = async (categoryLabel: string, userIdea: string): Promise<string> => {
  try {
    const client = getClient();
    const model = 'gemini-2.5-flash';
    const response = await client.models.generateContent({
      model,
      contents: `Create a highly detailed, artistic, and aesthetic image generation prompt based on this category: "${categoryLabel}" and this user idea: "${userIdea}". 
      The prompt should be optimized for an image generation model. 
      Include keywords about lighting, style (e.g., oil painting, 3d render, anime, photography), and mood. 
      Output ONLY the prompt string, no markdown, no explanations. Keep it under 50 words.`,
    });
    return response.text?.trim() || `${userIdea}, ${categoryLabel} style, aesthetic, 8k`;
  } catch (error: any) {
    // Silent fail for prompt generation to avoid UI noise
    // console.warn("Prompt expansion failed, using raw prompt.");
    return `${userIdea}, ${categoryLabel} style, high quality`;
  }
};

// New function to generate poster text content and styles
export const generatePosterMetadata = async (prompt: string): Promise<{ title: string; subtitle: string; accentColor: string; artPrompt: string }> => {
  try {
    const client = getClient();
    const model = 'gemini-2.5-flash';
    const response = await client.models.generateContent({
      model,
      contents: `Analyze this concept: "${prompt}". 
      1. Create a short, punchy, artistic title (max 3 words).
      2. Create a cryptic or poetic subtitle (max 10 words).
      3. Pick a hex color code that fits the mood.
      4. Create a visual art prompt for an image generator.
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            accentColor: { type: Type.STRING },
            artPrompt: { type: Type.STRING }
          },
          required: ["title", "subtitle", "accentColor", "artPrompt"]
        }
      }
    });
    
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("Failed to parse poster metadata");
  } catch (error) {
    // console.error("Error generating poster metadata:", error);
    return {
      title: "UNTITLED",
      subtitle: "The void stares back.",
      accentColor: "#E35336",
      artPrompt: prompt
    };
  }
};

// Internal helper to run the generation request
const runGenerationRequest = async (model: string, prompt: string, size?: string) => {
  const client = getClient();
  const config: any = {};
  
  // Configure Image Settings based on model capabilities
  const imageConfig: any = { aspectRatio: '1:1' };

  if (model.includes('pro') || model.includes('preview')) {
     // Pro/Preview models support imageSize
     if (size) {
       imageConfig.imageSize = size;
     }
  }
  
  config.imageConfig = imageConfig;
  
  // Add Safety Settings to prevent aggressive filtering of aesthetic prompts
  // Using string values for compatibility
  config.safetySettings = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
  ];

  try {
    const response = await client.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config
    });

    if (!response.candidates || response.candidates.length === 0) {
      // If blocked, it might not have candidates
      throw new Error("No candidates returned from model (likely safety block).");
    }

    // Iterate through parts to find the image
    for (const part of response.candidates[0].content?.parts || []) {
      if (part.inlineData) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        const base64EncodeString = part.inlineData.data;
        return `data:${mimeType};base64,${base64EncodeString}`;
      }
    }
    
    // console.warn(`No inlineData found in response for ${model}`);
    return null;
  } catch (e: any) {
    // We allow the caller to handle the logging/fallback
    throw e;
  }
};

// Generates multiple images with fallback logic
export const generateAestheticImages = async (prompt: string, count: number = 4): Promise<string[]> => {
  
  // Sequential execution for Flash model (avoids 429 Rate Limits)
  const generateSequential = async (modelName: string, useSize: boolean) => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
        try {
            const url = await runGenerationRequest(modelName, prompt, useSize ? '1K' : undefined);
            if (url) results.push(url);
        } catch (e: any) {
            const msg = e.message || '';
            // We warn here for debugging, but main error is handled at end
            console.warn(`Generation ${i+1} failed for ${modelName}:`, msg);
        }
        // Small delay to be gentle on rate limits
        if (i < count - 1) await new Promise(resolve => setTimeout(resolve, 500));
    }
    return results;
  };

  try {
    // STRICTLY USE GEMINI 2.5 FLASH IMAGE (Nano Banana)
    // Removed call to 'gemini-3-pro-image-preview' to avoid 403 Permission Errors.
    
    const images = await generateSequential('gemini-2.5-flash-image', false);
    if (images.length === 0) throw new Error("Flash model returned no images");
    return images;

  } catch (error: any) {
      console.error("All image generation attempts failed", error);
      throw error;
  }
};

export const analyzeVibe = async (imageUrl: string): Promise<{ title: string; description: string }> => {
    if (!imageUrl.startsWith('data:')) {
        return {
            title: "Aesthetic Vision",
            description: "A curated moment of beauty captured in time."
        };
    }

    try {
        const client = getClient();
        const base64Data = imageUrl.split(',')[1];
        // Extract mime type from data url
        const mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType } },
                    { text: "Analyze this image. Give it a short, poetic 3-word title and a single sentence aesthetic description." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["title", "description"]
                }
            }
        });
        
        const text = response.text;
        if(text) {
            return JSON.parse(text);
        }
        return { title: "Generated Art", description: "An AI generated masterpiece." };

    } catch (e) {
        // console.error("Error analyzing vibe", e);
        return { title: "Mystery Vibe", description: "Beauty beyond words." };
    }
}
