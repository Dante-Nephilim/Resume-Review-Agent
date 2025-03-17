import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const SYSTEM_PROMPT = `
You are an expert resume reviewer and career advisor.
Analyze the provided message, resume text and list of previous messages and provide:
1. A valid response for the latest message only.
`;
const handler = async (request: Request) => {
  const body = await request.json();
  const content = body.message + "\n" + body.allMessages.map((m) => m.role + ": " + m.content).join("\n");
  const stream = await client.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT + "\n" + body.resumeText,
      },
      { role: "user", content: content },
    ],
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: true,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "content-type": "text/event-stream",
    },
  });
};
export default handler;
