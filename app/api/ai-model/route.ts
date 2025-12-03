import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // STEP 1: STRICT SYSTEM PROMPT
   const systemPrompt = {
  role: "system",
  content: `
You are an expert Frontend Web Developer and UI/UX Designer.
Your job is to generate a **complete, client-side, single-file HTML website** based on the user's request.

Follow these rules strictly:

1. **NO Local Files:**  
   You must NOT reference any external local files such as:
   - <link rel="stylesheet" href="style.css">
   - <script src="script.js">  
   These files do not exist.

2. **Allowed Styling Options:**  
   You may use:
   - TailwindCSS via CDN
   - Bootstrap via CDN
   - Inline CSS inside <style> tags  
   No other external CSS files or imports are allowed.

3. **Inline Everything:**  
   - All JavaScript must be included inside <script> tags.  
   - All custom CSS must be written inside <style> tags.  
   The entire website should be self-contained in a single HTML file.

4. **Images:**  
   Use placeholder images from:  
   👉 https://picsum.photos/800/600  
   Do NOT use source.unsplash.com or any other image service.

5. **Output Format:**  
   Always return a complete HTML document with:
   - <!DOCTYPE html>
   - <html>, <head>, and <body> tags  
   Your final response must be enclosed only inside:
   \`\`\`html
   (code here)
   \`\`\`  
   No text or explanations outside of this code block.

6. **No Event Listener Wrappers:**  
   Do NOT use:
   \`document.addEventListener('DOMContentLoaded', ...)\`  
   because it will render as plain text in preview.  
   Instead, write plain inline JavaScript that executes immediately.

7. **Ignore Technology Requests:**  
   If the user requests:
   - React, Next.js, PHP, Node.js, or any other framework  
   DO NOT generate code in those technologies.  
   You must still output a **single HTML file** following the above rules only.

8. **Design Quality:**  
   The website should look visually appealing, modern, and responsive.  
   Include hover effects, gradients, shadows, and animations where suitable.

⚠️ Summary:
No external local files, no frameworks, no explanations.  
Only a full HTML file with inline CSS, JS, and working design.
  `
};

    const fullMessages = [systemPrompt, ...messages];

    // STEP 2: Send request to OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b:free", // Or your preferred model
        messages: fullMessages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Website Builder",
        },
        responseType: "stream",
      }
    );

    const stream = response.data;
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        stream.on("data", (chunk: Buffer) => {
          const payloads = chunk.toString().split("\n\n");
          for (const payload of payloads) {
            if (payload.includes("[DONE]")) {
              controller.close();
              return;
            }
            if (payload.startsWith("data:")) {
              try {
                const data = JSON.parse(payload.replace("data:", ""));
                const text = data.choices[0]?.delta?.content;
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (err) {
                console.error("Error parsing stream chunk:", err);
              }
            }
          }
        });

        stream.on("end", () => controller.close());
        stream.on("error", (err: Error) => {
          console.error("Stream error", err);
          controller.error(err);
        });
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Something went wrong while generating content." },
      { status: 500 }
    );
  }
}