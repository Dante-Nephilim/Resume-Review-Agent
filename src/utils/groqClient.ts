import axios from "axios";
import { Message } from "../App";

const baseURl = import.meta.env.PROD ? "" : import.meta.env.VITE_NETLIFY_FUNCTIONS_BASE_URL;

export async function analyzeResume(resumeText: string, onToken: (token: string) => void): Promise<void> {
  try {
    const response = await axios.post(`${baseURl}/.netlify/functions/groq`, { resumeText });
    onToken(response.data || "");
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
}

export async function getReplyFromGroq(
  message: string,
  allMessages: Message[],
  resumeText: string,
  onToken: (token: string) => void
): Promise<void> {
  try {
    const response = await axios.post(`${baseURl}/.netlify/functions/chat`, { message, allMessages, resumeText });
    onToken(response.data || "");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
