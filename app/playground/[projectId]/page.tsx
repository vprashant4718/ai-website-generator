'use client'
import PlaygroundHeader from "../_components/PlaygroundHeader"
import "../../globals.css"
import ChatSection from "../_components/ChatSection"
import WebsiteDesign from "../_components/WebsiteDesign"
import ElementSettingSection from "../_components/ElementSettingSection"
import { useParams, useSearchParams } from "next/navigation"
import axios from "axios"
import { useEffect, useState } from "react"


export type Frame = {
  projectId: String,
  frameId: String,
  designCode : String,
  chatMessages: Message[]
}

export type Message = {
    role: String,
    content: String
}

export default function page() {

  const {projectId} = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [ frameDetails, setFrameDetails ] = useState<Frame>(); 
  const [ loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode ] = useState<any>();

  if(!loading){
    console.log(generatedCode);
  }

useEffect(()=>{
  frameId && GetFrameDetails();
}, [frameId]);

  const GetFrameDetails = async() =>{
    const result = await axios.get('/api/frames?frameId='+ frameId+"&projectId="+projectId);
      console.log(result.data);
      setFrameDetails(result.data);
      if(result.data?.chatMessages?.length ==1){
        const userMsg = result.data?.chatMessages[0].content;
        SendMessage(userMsg);
      }
    
  }

  const SendMessage = async (userInput: string) => {
  setLoading(true);

  // 1️⃣ Add the user's message
  setMessages((prev) => [
    ...prev,
    { role: "user", content: userInput },
    { role: "assistant", content: "" },
  ]);

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

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    aiResponse += chunk;

    // 🔹 Detect start of code block
    if (!isCode && aiResponse.includes("```html")) {
      isCode = true;
      const index = aiResponse.indexOf("```html") + 7;
      const initialCodeChunk = aiResponse.slice(index);
      setGeneratedCode((prev: any) => (prev || "") + initialCodeChunk);
    } else if (isCode) {
      setGeneratedCode((prev: any) => (prev || "") + chunk);
    }

    // 🔹 Update the *last assistant message* instead of adding new ones
    setMessages((prev) => {
      const updated = [...prev];
      const lastMsg = updated[updated.length - 1];

      if (lastMsg.role === "assistant") {
        lastMsg.content = isCode
          ? "Your code is ready!"
          : aiResponse.trim();
      }

      return updated;
    });
  }

  setLoading(false);
};

useEffect(()=>{
  if(messages.length > 0 && !loading ){
    SaveMessages();
  }
},[messages]);

const SaveMessages = async()=>{
  const result = await axios.put('/api/chats', {
    messages: messages,
    frameId:frameId
  });
  console.log(result);
}

  return (
    <div>
        {/* playgroundHeader  */}
        <PlaygroundHeader />

        <div className="flex w-full justify-between">
            {/* chat section */}
            <div className="w-[25%]">
              <ChatSection loading={loading} messages={messages ?? [] } onSend={(input:string)=> SendMessage(input)}/>
            </div>

            {/* website design section */}
            <div className="w-[55%] ">
              <WebsiteDesign />
            </div>

            {/* element setting section */}
            <div className="w-[20%] ">
              <ElementSettingSection />
            </div>
        </div>
        
    </div>
  )
}
