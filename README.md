# Resume Review AI Agent

 React application for reviewing resumes and providing career advice with Ollama Server.

---

## DEMO: 
<a href="https://www.loom.com/share/9b2bc75400044a5c8990a27db9a53411?sid=9068aca8-bd50-40f7-ab52-6bab44249042" target="_blank"><p>Video Demo Link</p>
<img src="demo.gif" alt="Demo GIF">
</a>

---

## Dev Setup
- Clone the repo
- Run `npm install`
- Run `npm run dev`
- Make sure Ollama is running, open `http://localhost:11434/`
- Or you can use hosted Ollama server, by passing the host url in `src/utils/ollamaClient.ts`
- Pull Ollama model `llama3.2:1b`
- Open `http://localhost:5173/` in your browser
- Upload your resume and get analysis

---

## Tech Stack
- React
- Ollama Server
- `pdfjs-dist` for parsing the file.
- `ollama` package for interacting with Ollama Server.
- `tailwindcss` for styling.
- `lucide-react` for icons.

---

## Further Enhancements
- Allow user to chat with the agent
- Allow multiple Resumes to be uploaded and compared

