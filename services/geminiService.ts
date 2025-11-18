import { GoogleGenAI, Type } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing in environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY' });

export const generateCreativePrompt = async (categoryLabel: string, userIdea: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `Create a highly detailed, artistic, and aesthetic image generation prompt based on this category: "${categoryLabel}" and this user idea: "${userIdea}". 
      The prompt should be optimized for an image generation model (like Imagen). 
      Include keywords about lighting, style (e.g., oil painting, 3d render, anime, photography), and mood. 
      Output ONLY the prompt string, no markdown, no explanations. Keep it under 50 words.`,
    });
    return response.text?.trim() || `${userIdea}, ${categoryLabel} style, aesthetic, 8k`;
  } catch (error) {
    console.error("Error generating prompt:", error);
    return `${userIdea}, ${categoryLabel} style, high quality`;
  }
};

export const generateAestheticImage = async (prompt: string): Promise<{ url: string, mimeType: string } | null> => {
  try {
    // Using the high-quality image generation model as per guidelines
    const model = 'imagen-4.0-generate-001'; 
    
    const response = await ai.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4', // Portrait aspect ratio for pinterest style
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const mimeType = 'image/jpeg';
      const url = `data:${mimeType};base64,${base64ImageBytes}`;
      return { url, mimeType };
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const analyzeVibe = async (imageUrl: string): Promise<{ title: string; description: string }> => {
    // If it's a base64 data URL, we need to strip the prefix to send to Gemini if we were sending bytes.
    // However, for picsum urls (external), we can't easily send them unless we fetch them first.
    // This function assumes we are analyzing a generated image which is base64.
    
    if (!imageUrl.startsWith('data:')) {
        return {
            title: "Aesthetic Vision",
            description: "A curated moment of beauty captured in time."
        };
    }

    try {
        const base64Data = imageUrl.split(',')[1];
        const mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));

        const response = await ai.models.generateContent({
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
        console.error("Error analyzing vibe", e);
        return { title: "Mystery Vibe", description: "Beauty beyond words." };
    }
}