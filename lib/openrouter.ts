const OPENROUTER_DEFAULT_URL = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1/chat/completions";

export const OPENROUTER_MODELS = {
  PLAN_A: "google/gemini-3-pro-preview",
  PLAN_B: "openai/gpt-5.1",
  MERGER: "anthropic/claude-opus-4.5",
} as const;

export type OpenRouterModelKey = keyof typeof OPENROUTER_MODELS;

export async function callOpenRouterChat(options: {
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  maxTokens?: number;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const res = await fetch(OPENROUTER_DEFAULT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("OpenRouter error:", text);
    throw new Error("OpenRouter request failed");
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    console.error("Invalid OpenRouter response content:", data);
    throw new Error("Invalid OpenRouter response content");
  }

  return content;
}

/**
 * Helper to call one of our standard SEP models by key.
 * Example: await callSepModel("PLAN_A", messages)
 */
export async function callSepModel(
  key: OpenRouterModelKey,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  temperature?: number,
  maxTokens?: number
) {
  const model = OPENROUTER_MODELS[key];
  return callOpenRouterChat({
    model,
    messages,
    temperature,
    maxTokens,
  });
}
