import React, { useState } from 'react'
import { Message } from '../[projectId]/page'
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2Icon } from 'lucide-react'; 

type Props = {
  loading: boolean,
  messages:Message[],
  onSend: any
}

export default function ChatSection({messages, loading, onSend}:Props) {
    const [input, setInput] = useState<string>();

    const handleSend =()=>{
      if(!input?.trim()) return;
      onSend(input);
      setInput('');
    }
  return (
    <div className='p-4  shadow h-[91vh] flex flex-col'>
      {/* message section  */}
      <div className='flex-1 overflow-y-auto p-6 space-y-3 flex-col'>
        {messages?.length === 0 ?
        (
          <p>No Messages</p>
        ):(
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role == 'user' ? 'justify-end': 'justify-start'}`}>
              <div className={`p-2 rounded-lg max-w-[80%] ${msg.role === 'user'? 'bg-gray-100 text-black':'bg-gray-300 dark:bg-gray-800 text-black dark:text-white'}`}>
                {msg.content}
              </div>
             
            </div>
          ))
        )}
         {loading && 
                 <div className={`flex justify-center items-center  p-4 `}>
                   <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-800 dark:border-zinc-100'> </div>
                    <span className='ml-2 text-zinc-800 dark:text-zinc-100 '> Thinking... </span>
                  
                  
                </div>
              }
      </div>

      <div className='p-2 border-t flex items-center gap-2'> 
        <textarea placeholder='Describe your website design idea'  className='w-full p-2 px-3 border border-gray-400 rounded-lg focus:outline-none resize-none' value={input} onChange={(e)=> setInput(e.target.value)}/>
        <Button onClick={handleSend} disabled={!input}  > {!loading? <ArrowUp />: <Loader2Icon className='animate-spin' />}</Button>
      </div>
    </div>
  )
}
