import axios from "axios";

const baseURl = process.env.VITE_NETLIFY_FUNCTIONS_BASE_URL;

export async function analyzeResume(resumeText: string, onToken: (token: string) => void): Promise<void> {
  try {
    const response = await axios.post(`${baseURl}/.netlify/functions/groq`, { resumeText });
    onToken(response.data || "");
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
}
