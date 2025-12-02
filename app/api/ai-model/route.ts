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
      Your task is to generate a purely client-side, single-file HTML website based on the user's request.

      IMPORTANT RULES:
      1. NO EXTERNAL LOCAL CSS/JS FILES: You must NOT use <link rel="stylesheet" href="style.css"> or <script src="script.js">. These files do not exist.
      2. USE  CSS:  use  css 
      3. INLINE EVERYTHING: If you need custom CSS, put it inside <style> tags. If you need JS, put it inside <script> tags.
      4. IMAGES: Use "https://picsum.photos/800/600" for placeholders. Do NOT use source.unsplash.com.
      5. COMPLETE HTML: Return the full code including <!DOCTYPE html>, <html>, <head>, and <body>.
      6. RESPONSE FORMAT: Only return the code inside \`\`\`html \`\`\` blocks. Do not explain the code.
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