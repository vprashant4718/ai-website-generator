"use client"
import { ModeToggle } from '@/components/theme-toggle'
import Image from 'next/image'
import Logo from '../../assets/ai-logo.png';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

const HeadButtons = [
  {
    name: "Pricing",
    path:"/pricing"
  },
  {
    name:"Contact Us",
    path:"/contact"
  }
]; 



export default function Header() {

  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className='flex flex-row justify-between items-center p-3'>
      <div className='flex flex-row justify-center items-center gap-3'>
        <Image src={Logo} alt='logo' width={40} height={40}/>
        <h2 className='font-semibold text-xl'>AI Website Builder</h2>
      </div>

        <div className='flex flex-row justify-center items-center gap-5'>
          {HeadButtons.map((menu, index)=>(
            <Link href={menu.path} key={index}>
              <Button variant={'ghost'}  >{menu.name}</Button>
            </Link>
          ))}
        </div>

        <div className='flex flex-row justify-center items-center gap-5'>
        
          {isSignedIn?
          <Link href={"/workspace"}>
            <Button size={"sm"} >Get Started <ArrowRight/></Button>
          </Link>
              :
          <SignInButton mode='modal' forceRedirectUrl={"/workspace"}>
            <Button size={"sm"} >Get Started <ArrowRight/></Button>
          </SignInButton> }
          <ModeToggle />
          {isSignedIn &&  <UserButton />      }
        </div>
    </div>
  )
}
