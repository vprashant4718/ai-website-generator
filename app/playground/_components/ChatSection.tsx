import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../[projectId]/page';
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2Icon } from 'lucide-react';

type Props = {
  loading: boolean;
  messages: Message[];
  onSend: (text: string) => void;
};

export default function ChatSection({ messages, loading, onSend }: Props) {
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null); // 👈 ref to the bottom of chat

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  // 👇 Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div className="p-4 shadow h-[91vh] flex flex-col">
      {/* Message Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 flex-col">
        {messages?.length === 0 ? (
          <p className="text-center text-gray-500">No Messages</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] text-sm sm:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gray-100 text-black'
                    : 'bg-gray-300 dark:bg-gray-800 text-black dark:text-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zinc-800 dark:border-zinc-100"></div>
            <span className="ml-2 text-zinc-800 dark:text-zinc-100">
              Thinking...
            </span>
          </div>
        )}

        {/* 👇 This keeps scroll always at bottom */}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Section */}
      <div className="p-2 border-t flex items-center gap-2">
        <textarea
          placeholder="Describe your website design idea"
          className="w-full p-2 px-3 border border-gray-400 rounded-lg focus:outline-none resize-none"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={!input || loading}>
          {!loading ? <ArrowUp /> : <Loader2Icon className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
