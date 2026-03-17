import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const geminiClient = apiKey ? new GoogleGenerativeAI(apiKey) : undefined;

export const isGeminiConfigured = Boolean(apiKey);

const DEFAULT_MODEL_FALLBACKS = [
	"gemini-2.0-flash",
	"gemini-1.5-flash-latest",
	"gemini-1.5-pro-latest",
	"gemini-1.5-pro",
];

export const generateGeminiText = async (
	prompt: string,
	preferredModels: string[] = []
): Promise<string> => {
	if (!geminiClient) {
		throw new Error("Gemini client is not configured.");
	}

	const models = [...preferredModels, ...DEFAULT_MODEL_FALLBACKS].filter(
		(model, index, arr) => arr.indexOf(model) === index
	);

	let lastError: unknown;
	for (const modelName of models) {
		try {
			const model = geminiClient.getGenerativeModel({ model: modelName });
			const result = await model.generateContent(prompt);
			return result.response.text();
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError ?? new Error("Gemini generation failed.");
};
