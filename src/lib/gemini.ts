import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const geminiClient = apiKey ? new GoogleGenerativeAI(apiKey) : undefined;

export const isGeminiConfigured = Boolean(apiKey);

const DEFAULT_MODEL_FALLBACKS = [
	"gemini-2.0-flash",
	"gemini-2.0-flash-lite",
	"gemini-2.5-flash",
	"gemini-2.5-pro",
];

type ListModelsResponse = {
	models?: Array<{
		name?: string;
		supportedGenerationMethods?: string[];
	}>;
};

let availableModelCache: string[] | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const extractStatusCode = (error: unknown): number | null => {
	if (!error) {
		return null;
	}

	const maybeStatus = (error as { status?: number }).status;
	if (typeof maybeStatus === "number") {
		return maybeStatus;
	}

	const message = String((error as { message?: string }).message ?? error);
	const match = message.match(/\[(\d{3})\s*\]/);
	return match ? Number(match[1]) : null;
};

export const isGeminiRateLimitError = (error: unknown): boolean => {
	return extractStatusCode(error) === 429;
};

const listGenerateContentModels = async (): Promise<string[]> => {
	if (!apiKey) {
		return [];
	}

	if (availableModelCache) {
		return availableModelCache;
	}

	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
		);
		if (!response.ok) {
			return [];
		}

		const data = (await response.json()) as ListModelsResponse;
		const models = (data.models ?? [])
			.filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
			.map((model) => model.name?.replace(/^models\//, ""))
			.filter((name): name is string => Boolean(name));

		availableModelCache = models;
		return models;
	} catch {
		return [];
	}
};

export const generateGeminiText = async (
	prompt: string,
	preferredModels: string[] = []
): Promise<string> => {
	if (!geminiClient) {
		throw new Error("Gemini client is not configured.");
	}

	const availableModels = await listGenerateContentModels();
	const configuredPool = availableModels.length > 0 ? availableModels : DEFAULT_MODEL_FALLBACKS;

	const models = [...preferredModels, ...configuredPool].filter(
		(model, index, arr) => arr.indexOf(model) === index
	).filter((model) => availableModels.length === 0 || availableModels.includes(model));

	let lastError: unknown;
	for (const modelName of models) {
		for (let attempt = 0; attempt < 3; attempt += 1) {
			try {
				const model = geminiClient.getGenerativeModel({ model: modelName });
				const result = await model.generateContent(prompt);
				return result.response.text();
			} catch (error) {
				lastError = error;
				if (isGeminiRateLimitError(error) && attempt < 2) {
					await sleep(600 * (attempt + 1));
					continue;
				}
				break;
			}
		}
	}

	throw lastError ?? new Error("Gemini generation failed.");
};
