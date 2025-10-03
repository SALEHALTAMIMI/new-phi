import { Scholarship, Language } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

interface SearchParams {
    text?: string;
    specialty?: string;
    level?: string;
}

const scholarshipSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.NUMBER },
            title: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
                required: ['en', 'ar']
            },
            university: { type: Type.STRING },
            country: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
                required: ['en', 'ar']
            },
            countryCode: { type: Type.STRING },
            deadline: { type: Type.STRING },
            level: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
                required: ['en', 'ar']
            },
            specialty: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
                required: ['en', 'ar']
            },
            isOpen: { type: Type.BOOLEAN },
            isOpeningSoon: { type: Type.BOOLEAN },
            summary: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
                required: ['en', 'ar']
            },
            requirements: { 
                type: Type.OBJECT,
                properties: {
                    en: { type: Type.ARRAY, items: { type: Type.STRING } },
                    ar: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['en', 'ar']
            },
            benefits: {
                type: Type.OBJECT,
                properties: {
                    en: { type: Type.ARRAY, items: { type: Type.STRING } },
                    ar: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['en', 'ar']
            },
            applyLink: { type: Type.STRING },
        },
    },
};

/**
 * Fetches a fresh list of top scholarships for the homepage using the Gemini API.
 * @param lang - The user's current language.
 * @returns A promise that resolves to an array of AI-generated scholarships.
 */
export const fetchHomepageScholarships = async (lang: Language): Promise<Scholarship[]> => {
    const prompt = `Act as an expert scholarship database API for the "Phi" platform. Generate a list of 6 popular and highly diverse scholarships that are currently open (isOpen: true) or will be opening soon (isOpeningSoon: true). 
    Ensure a wide variety of academic fields (e.g., Arts, STEM, Business, Health) and geographical locations (e.g., Europe, North America, Asia, Middle East).
    The user's preferred language is ${lang === 'ar' ? 'Arabic' : 'English'}.

    IMPORTANT: You MUST generate all text content (titles, summaries, requirements, etc.) in BOTH English and Arabic for each scholarship.

    For each scholarship, provide the following details adhering strictly to the JSON schema: id (unique integer), title (en/ar), university, country (en/ar), countryCode (ISO 3166-1 alpha-2, e.g., "US", "DE"), deadline (YYYY-MM-DD format), level (en/ar), specialty (en/ar), isOpen, isOpeningSoon, a concise summary (en/ar), a list of 3-4 requirements (en/ar), a list of 3-4 benefits (en/ar), and a realistic application link.

    Return ONLY a JSON array of objects that validates against the provided schema. Do not include any other text or explanations.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: scholarshipSchema,
            },
        });
        
        const jsonText = response.text.trim();
        if (!jsonText) return [];
        return JSON.parse(jsonText) as Scholarship[];
    } catch (error) {
        console.error("Gemini API Error (Homepage Scholarships):", error);
        return []; // Return empty array on error to prevent crash
    }
};

/**
 * Performs a live search for scholarships using the Gemini API.
 * @param params - The search parameters from the user.
 * @param lang - The user's current language.
 * @returns A promise that resolves to an array of AI-generated scholarships.
 */
export const searchScholarships = async (params: SearchParams, lang: Language): Promise<Scholarship[]> => {
    
    const fullQuery = `${params.text} ${params.specialty && params.specialty !== 'all' ? `in ${params.specialty}` : ''} ${params.level && params.level !== 'all' ? `for ${params.level} level` : ''}`.trim();
    
    const prompt = `Act as an expert scholarship database API for the "Phi" platform. A student is searching for scholarships. Based on their query, generate a list of 6 realistic, distinct, and relevant scholarships.
    The user's query is: "${fullQuery}".
    The user's preferred language is ${lang === 'ar' ? 'Arabic' : 'English'}.

    IMPORTANT: You MUST generate all text content (titles, summaries, requirements, etc.) in BOTH English and Arabic for each scholarship, regardless of the user's preferred language.

    For each scholarship, provide the following details adhering strictly to the JSON schema: id (unique integer), title (en/ar), university, country (en/ar), countryCode (ISO 3166-1 alpha-2, e.g., "US", "DE"), deadline (YYYY-MM-DD format), level (en/ar), specialty (en/ar), isOpen, isOpeningSoon, a concise summary (en/ar), a list of 3-4 requirements (en/ar), a list of 3-4 benefits (en/ar), and a realistic application link.

    Return ONLY a JSON array of objects that validates against the provided schema. Do not include any other text or explanations.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: scholarshipSchema,
            },
        });
        
        const jsonText = response.text.trim();
        if (!jsonText) {
            return [];
        }
        return JSON.parse(jsonText) as Scholarship[];
    } catch (error) {
        console.error("Gemini API Error (Scholarship Search):", error);
        return [];
    }
};