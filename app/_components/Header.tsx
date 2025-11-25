import { ModeToggle } from '@/components/theme-toggle'
import Image from 'next/image'
import Logo from '../../assets/ai-logo.png';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
  return (
    <div className='flex flex-row justify-between items-center p-3'>
      <div className='flex flex-row justify-center items-center gap-3'>
        <Image src={Logo} alt='logo' width={40} height={40}/>
        <h2 className='font-semibold text-xl'>AI Website Generator</h2>
      </div>

        <div className='flex flex-row justify-center items-center gap-5'>
          {HeadButtons.map((menu, index)=>(
            <Link href={menu.path} key={index}>
              <Button variant={'ghost'}  >{menu.name}</Button>
            </Link>
          ))}
        </div>

        <div className='flex flex-row justify-center items-center gap-5'>
          <Button size={"sm"} >Get Started <ArrowRight/></Button>
          <ModeToggle />
        </div>
    </div>
  )
}
