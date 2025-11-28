import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Logo from '@/assets/ai-logo.png'

export default function PlaygroundHeader() {
  return (
    <div className='flex flex-row justify-between items-center p-4 shadow '>
        <Image src={Logo} alt='logo' width={40} height={40}/>
        <Button> Save </Button>
    </div>
  )
}
