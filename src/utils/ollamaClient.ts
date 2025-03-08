import { Ollama } from "ollama";

const ollama = new Ollama();

const SYSTEM_PROMPT = `
You are an expert resume reviewer and career advisor.
Analyze the provided resume and provide:
1. A detailed review of the resume's strengths and weaknesses
2. Specific suggestions for improvement
3. Career path suggestions based on the candidate's experience
4. Skills assessment and recommendations for skill development
`;

export async function analyzeResume(resumeText: string, onToken: (token: string) => void): Promise<void> {
  try {
    const response = await ollama.generate({
      model: "llama3.2:1b",
      prompt: resumeText,
      system: SYSTEM_PROMPT,
      stream: true,
    });

    for await (const token of response) {
      onToken(token.response);
    }
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
}
