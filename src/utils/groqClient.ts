import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

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
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: resumeText,
        },
      ],
      model: "llama-3.3-70b-versatile",
      stream: true,
    });
    for await (const token of response) {
      onToken(token.choices[0].delta.content || "");
    }
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
}
