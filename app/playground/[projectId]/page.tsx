'use client';

import PlaygroundHeader from "../_components/PlaygroundHeader";
import "../../globals.css";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
// import ElementSettingSection from "../_components/ElementSettingSection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Message[];
};

export type Message = {
  role: string;
  content: string;
};

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const params = useSearchParams();
  const frameId = params.get("frameId");

  const [frameDetails, setFrameDetails] = useState<Frame | undefined>();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  useEffect(() => {
    if (frameId) {
      GetFrameDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameId]);

  const GetFrameDetails = async () => {
    try {
      const result = await axios.get(
        `/api/frames?frameId=${frameId}&projectId=${projectId}`
      );
      console.log("Frame details:", result.data);
      setFrameDetails(result.data);

      const designCode = result.data?.designCode;
      const index = designCode?.indexOf('```html')+7;
      const formattedCode = designCode?.slice(index);
      setGeneratedCode(formattedCode);

      if (result.data?.chatMessages?.length === 1) {
        const userMsg = result.data.chatMessages[0].content;
        await SendMessage(userMsg);
      } else if (result.data?.chatMessages) {
        setMessages(result.data.chatMessages);
      }
    } catch (error) {
      console.error("Error fetching frame details:", error);
    }
  };

  const SendMessage = async (userInput: string) => {
    if (!frameId || !projectId) {
      toast.error("Missing frame or project ID");
      return;
    }

    setLoading(true);

    // Build messages locally so we can save them once at the end
    let allMessages: Message[] = [];
    setMessages((prev) => {
      allMessages = [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content: "" },
      ];
      return allMessages;
    });

    const result = await fetch("/api/ai-model", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: userInput }],
      }),
    });

    const reader = result.body?.getReader();
    const decoder = new TextDecoder();

    let aiResponse = "";
    let isCode = false;
    let codeBuffer = ""; // will hold only the HTML/code part

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      aiResponse += chunk;

      // Detect start of code block
      if (!isCode && aiResponse.includes("```html")) {
        isCode = true;
        const index = aiResponse.indexOf("```html") + 7;
        const initialCodeChunk = aiResponse.slice(index);
        codeBuffer += initialCodeChunk;

        setGeneratedCode((prev) => (prev || "") + initialCodeChunk);


      } else if (isCode) {
        codeBuffer += chunk;
        let cleaned = chunk
          ?.replace(/```[a-z]*\n?/gi, "") // remove ```html or ```css
          ?.replace(/```/g, "")
          ?.trim();

        // Step 2: Extract only <html>...</html> if present
        const htmlMatch = cleaned.match(/<html[\s\S]*<\/html>/i);
        if (htmlMatch) {
          return htmlMatch[0]; // Only the actual HTML document
        }

        // Step 3: If no <html>, wrap detected HTML-like part
        // Strip all markdown explanations (like ### How to test)

        cleaned = cleaned?.replace(/#+\s*How to[\s\S]*$/gi,"").trim();
        setGeneratedCode((prev) => (prev || "") + cleaned);
      }

      // Update the last assistant message progressively
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];

        if (lastMsg && lastMsg.role === "assistant") {
          lastMsg.content = isCode
            ? "Your code is ready!"
            : aiResponse.trim();
        }

        allMessages = updated;
        return updated;
      });
    }

    setLoading(false);

    // ✅ Save messages once, after streaming finished
    try {
      if (allMessages.length > 0) {
        await SaveMessages(allMessages);
      }
    } catch (e) {
      console.error("Error saving chat messages:", e);
    }

    // ✅ Save generated code once, after full code received
    try {
      if (codeBuffer) {
        await saveGeneratedCode(codeBuffer);
        toast.success("Website is Ready");
         window.location.reload();
      }
    } catch (e) {
      console.error("Error saving generated code:", e);
    }
  };

  const SaveMessages = async (msgs: Message[]) => {
    if (!frameId) return;
    await axios.put("/api/chats", {
      messages: msgs,
      frameId: frameId,
    });
  };

  const saveGeneratedCode = async (code: string) => {
    if (!frameId || !projectId) return;

    const result = await fetch("/api/frames", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        designCode: code,
        frameId: frameId,
        projectId: projectId,
      }),
    });

    if (!result.ok) {
      const errText = await result.text();
      console.error("Error saving frame:", errText);
      throw new Error("Failed to save generated code");
    }

    console.log("Frame updated:", result.status);
  };

  return (
    <div>
      {/* playgroundHeader */}
      <PlaygroundHeader />

      <div className="flex w-full justify-between">
        {/* chat section */}
        <div className="w-[25%]">
          <ChatSection
            loading={loading}
            messages={messages}
            onSend={(input: string) => SendMessage(input)}
          />
        </div>

        {/* website design section */}
        <div className="w-[75%]">
          <WebsiteDesign generatedCode={generatedCode || ""} />
        </div>

        {/* element setting section (later) */}
        {/* <div className="w-[20%]">
          <ElementSettingSection />
        </div> */}
      </div>
    </div>
  );
}
