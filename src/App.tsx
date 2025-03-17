import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { extractTextFromPDF } from "./utils/pdfParser";
// import { analyzeResume } from "./utils/ollamaClient";

import { Loader2 } from "lucide-react";
import { analyzeResume, getReplyFromGroq } from "./utils/groqClient";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [showChat, setShowChat] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [isResponding, setIsResponding] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setAnalysis(null);
      setResumeText("");
      setAllMessages([]);
      setShowChat(false);
      setMessage("");

      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      setResumeText(text);
      // Analyze resume using Ollama with streaming
      await analyzeResume(text, (token: string) => {
        // Append each token as it arrives
        setAnalysis((prev) => (prev || "") + token);
        setShowChat(true);
      });
    } catch (err) {
      setError("Error processing resume. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      setIsResponding(true);
      setAllMessages((prev) => [...prev, { role: "user", content: message }]);
      setMessage("");
      await getReplyFromGroq(message, allMessages, resumeText, (reply: string) => {
        setAllMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      });
    } catch (err) {
      setError("Error sending message. Please try again.");
      console.error(err);
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Resume Review</h1>
          <p className="text-gray-600">Upload your resume for instant AI-powered analysis and career suggestions</p>
        </div>
        <div className="flex justify-center items-center">
          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
        </div>
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Analyzing your resume...</span>
          </div>
        )}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
        {showChat && (
          <div>
            {allMessages &&
              allMessages.map((message, index) => (
                <div key={index}>
                  <div>
                    <div>
                      <div
                        className={`p-4 mb-2 rounded-sm   ${
                          message.role === "user"
                            ? "bg-blue-50 text-black-800 ml-auto text-right"
                            : "bg-green-50 text-black-800 mr-auto text-left"
                        }`}
                      >
                        <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div className="grid grid-cols-[1fr_200px] gap-4">
              <input
                type="text"
                className="p-4 m-2 border-2  rounded-sm border-gray-800"
                placeholder="Ask further questions about the resume"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <button
                className="p-4 m-2 text-gray-100 rounded-sm bg-blue-700 cursor-pointer"
                disabled={isResponding}
                onClick={sendMessage}
              >
                {isResponding ? "..." : "Send"}
              </button>
            </div>
          </div>
        )}
        {analysis && (
          <>
            <h2 className="text-2xl font-bold border-t-2 border-gray-800 pt-4">Analysis</h2>
            <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
