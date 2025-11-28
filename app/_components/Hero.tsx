"use client"
import { Button } from '@/components/ui/button'
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, Loader2Icon, User } from 'lucide-react'
import { useState } from 'react'
import '../globals.css'
import { SignInButton } from '@clerk/nextjs'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const suggestion = [
  {
    label: 'Dashboard',
    prompt: 'Create an analytics dashboard to track customers and revenue data for a SaaS',
    icon: LayoutDashboard
  },
  {
    label: 'Sign Up Form',
    prompt: 'Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox',
    icon: Key
  },
  {
    label: 'Hero',
    prompt: 'Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect, subtitle, CTA, small social proof and an image...',
    icon: HomeIcon
  },
  {
    label: 'User Profile Card',
    prompt: 'Create a modern user profile card component for a social media website',
    icon: User
  }
];

export default function Hero() {

  const router = useRouter();
  const [userInput, setUserInput] = useState <string>();
  const [loading, setLoading] = useState(false);

  const CreateNewProject = async()=>{
    setLoading(true);
    const projectId = uuidv4();
    const frameId = generateRandomFrameNumber();
    const messages = [
      {
        role:'user',
        content: userInput
      }
    ]
    try {
     
      const result = await axios.post('api/projects', {
        projectId:  projectId,
        frameId: frameId,
        messages: messages
      });
      console.log(result.data);
      setLoading(false);
      toast.success('Project Created');
      router.push(`/playground/${projectId}?frameId=${frameId}`)

    } catch (error) {
      toast.error("Internal Server Error");
      setLoading(false)
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-[80vh]'>
        <h1 className='text-6xl font-bold'> What should we Design?</h1>
        <p className='mt-2 text-xl text-gray-500'> Generate, edit, explore designs with AI. Export to Code.</p>

        <div className='w-full max-w-2xl p-5 border mt-5 rounded-2xl'>
            <textarea name="describe_idea" placeholder='Describe your page design' className=' w-full h-24 outline-none focus:outline-none focus:ring-0 resize-none'
             value={userInput} onChange={(e)=> setUserInput(e.target.value)}/>

            <div className='flex flex-row justify-between items-center'>
                <Button variant={"ghost"} size={"icon"}><ImagePlus className='w-10'/></Button>
                {/* <SignInButton mode='modal' forceRedirectUrl={"/workspace"} > */}
                  <Button disabled={!userInput || loading} onClick={CreateNewProject} >
                   {loading? <Loader2Icon className='animate-spin' />: <ArrowUp size={30} />}</Button>
                {/* </SignInButton> */}
            </div>
        </div>

        <div className='flex flow-row justify-center items-center gap-3 mt-2'>
          {suggestion.map((suggestion, index)=>(
            <Button key={index} variant={"outline"} onClick={()=>setUserInput(suggestion.prompt)}><suggestion.icon /> {suggestion.label}</Button>
          ))}
        </div>
    </div>
  )
}




const generateRandomFrameNumber = () =>{
  const num = Math.floor(Math.random()*10000)
  return num;
}

