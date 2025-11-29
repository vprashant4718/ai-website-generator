import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Logo from '@/assets/ai-logo.png'
import { ModeToggle } from '@/components/theme-toggle'

export default function PlaygroundHeader() {
  return (
    <div className='flex flex-row justify-between items-center p-4 shadow '>
        <Image src={Logo} alt='logo' width={40} height={40}/>

        <div className='flex flex-row justify-center items-center gap-3 '>
            <Button> Save </Button>
            <ModeToggle />
        </div>
    </div>
  )
}
