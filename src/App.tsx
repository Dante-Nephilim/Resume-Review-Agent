import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { extractTextFromPDF } from "./utils/pdfParser";
// import { analyzeResume } from "./utils/ollamaClient";

import { Loader2 } from "lucide-react";
import { analyzeResume } from "./utils/groqClient";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setAnalysis(null);

      // Extract text from PDF
      const text = await extractTextFromPDF(file);

      // Analyze resume using Ollama with streaming
      await analyzeResume(text, (token: string) => {
        // Append each token as it arrives
        setAnalysis((prev) => (prev || "") + token);
      });
    } catch (err) {
      setError("Error processing resume. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
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
        <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
      </div>
    </div>
  );
}

export default App;
