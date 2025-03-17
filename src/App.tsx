import { useEffect, useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { extractTextFromPDF } from "./utils/pdfParser";
import { Loader2 } from "lucide-react";
import axios from "axios";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const baseURl = import.meta.env.PROD ? "" : import.meta.env.VITE_NETLIFY_FUNCTIONS_BASE_URL;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [showChat, setShowChat] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    const messagesElement = document.getElementById("messages");
    console.log(messagesElement?.lastElementChild);
    messagesElement?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setAnalysis(null);
      setResumeText("");
      setAllMessages([]);
      setShowChat(false);
      setMessage("");

      const text = await extractTextFromPDF(file);
      setResumeText(text);
      const response = await axios.post(`${baseURl}/.netlify/functions/groq`, { resumeText: text });
      setAnalysis(response.data || "");
      setShowChat(true);
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
      setAllMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: message }]);
      setMessage("");
      const response = await axios.post(`${baseURl}/.netlify/functions/chat`, { message, allMessages, resumeText });
      const newId = crypto.randomUUID();
      setAllMessages((prev) => [...prev, { id: newId, role: "assistant", content: response.data || "" }]);
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
            <div id="messages">
              {allMessages.map((message) => (
                <div key={message.id} id={message.id}>
                  <div>
                    <div>
                      <div
                        className={`p-4 mb-4 rounded-sm   ${
                          message.role === "user"
                            ? "bg-blue-100 text-black-800 ml-auto text-right"
                            : "bg-green-50 text-black-800 mr-auto text-left"
                        }`}
                      >
                        <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold pt-4">Ask Further Questions</h2>
            <form
              className="grid grid-cols-[1fr_200px] gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (isResponding) return;
                sendMessage();
              }}
            >
              <input
                type="text"
                className="p-4 mt-2 border-2  rounded-sm border-gray-800"
                placeholder="Ask further questions about the resume"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <button className="p-4 mt-2 text-gray-100 rounded-sm bg-blue-700 cursor-pointer" disabled={isResponding}>
                {isResponding ? "..." : "Send"}
              </button>
            </form>
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
