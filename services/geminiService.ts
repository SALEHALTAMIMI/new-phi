import { GoogleGenAI, Type } from "@google/genai";

// The API key is sourced from the environment variable `process.env.API_KEY`.
// This is a secure practice and assumes the key is set in the deployment environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

/**
 * A generic function to call the Gemini API for text generation.
 * @param prompt - The text prompt to send to the model.
 * @returns The generated text from the model.
 */
export const generateContent = async (prompt: string): Promise<string> => {
  console.log("Calling Gemini API with prompt:", prompt);
  try {
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content from Phi Assistant.");
  }
};

interface CertificateDescription {
    short: string;
    long: string;
}

/**
 * Generates structured short and long descriptions for a certificate.
 * @param name - The name of the certificate.
 * @param issuer - The issuing organization.
 * @param duration - The duration of the course/certificate.
 * @param description - A simple user-provided description.
 * @param lang - The language for the output.
 * @returns An object containing 'short' and 'long' descriptions.
 */
export const getCertificateDescription = async (name: string, issuer: string, duration: string, description: string, lang: string): Promise<CertificateDescription> => {
    const prompt = `Generate a short (for a CV) and a long (for LinkedIn/SOP) professional description for the following certificate in ${lang === 'ar' ? 'Arabic' : 'English'}.
    - Certificate Name: ${name}
    - Issued by: ${issuer}
    - Duration: ${duration}
    - User's description: ${description}
    
    Return the result as a JSON object with two keys: "short" and "long".`;
    
    console.log("Calling Gemini API for certificate description with prompt:", prompt);
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        short: { type: Type.STRING },
                        long: { type: Type.STRING },
                    },
                    required: ["short", "long"],
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CertificateDescription;

    } catch (error) {
        console.error("Gemini API Error (Certificate Description):", error);
        throw new Error("Failed to generate certificate description from Phi Assistant.");
    }
};


/**
 * Generates a typical behavioral interview question.
 * @param lang - The language for the question ('en' or 'ar').
 * @returns A string containing an interview question.
 */
export const getInterviewQuestion = async (lang: string): Promise<string> => {
    const prompt = `Generate a common behavioral interview question appropriate for a university student applying for scholarships. The question should be in ${lang === 'ar' ? 'Arabic' : 'English'}. For example: 'Tell me about a time you faced a challenge.' or 'Describe a situation where you demonstrated leadership skills.'`;
    return generateContent(prompt);
};