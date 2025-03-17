# Resume Review AI Agent

 React AI application for reviewing resumes and providing career advice.

---

## DEMO: 
<a href="https://www.loom.com/share/4ad8fe34838d419b8695b0c3653cf28d?sid=c508949c-4ae1-4538-810d-0ab03dde9265" target="_blank"><p>Video Demo Link</p>
<img src="demo.gif" alt="Demo GIF">
</a>

---

## Dev Setup
- `git clone REPO_URL`
- create `.env`
- add `VITE_NETLIFY_FUNCTIONS_BASE_URL` & `GROQ_API_KEY` to `.env`
- `npm install` to install dependencies
- install netlify cli `npm add -g netlify-cli`
- `netlify login` then `netlify link` link to netlify app
- `netlify dev` to run development server

---

## Tech Stack
- React
- `netlify-serverless-functions`
- `pdfjs-dist` for parsing the file.
- `tailwindcss` for styling.
- `lucide-react` for icons.
- `groq-sdk` for interacting with Groq Server.


---

## Further Enhancements
- Allow comparison of multiple Resumes at a time.
- Store previous analysis and chats for users to continue from where they left off

