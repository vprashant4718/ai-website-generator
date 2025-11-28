import { ModeToggle } from '@/components/theme-toggle'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

export default function AppHeader() {
  return (
    <div className='flex justify-between items-center p-2 shadow'>
        <SidebarTrigger />
        <div className='flex justify-center items-center gap-5'>
        <UserButton />
        <ModeToggle />
        </div>
    </div>
  )
}
