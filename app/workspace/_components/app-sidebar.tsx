import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Logo from "@/assets/ai-logo.png"


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row justify-center items-center gap-4 pt-5">
           <Image src={Logo} alt='logo' width={40} height={40}/>
           <h1 className="font-bold text-lg">AI Website Builder</h1>
        </div>       
      </SidebarHeader>
      <SidebarContent className="p-2 pt-8">
            <Button>+ Add New Project</Button>
        <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            { 0 &&
            <h2 className="text-sm px-2 text-gray-500">No Projects</h2>}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 border rounded-xl space-y-3 bg-secondary">
            <h2 className="flex justify-between items-center pr-8">Remaining Credits: <span className="font-bold">2</span></h2>
            
            <Progress value={40} />
            <Button className="w-full">
                Upgrade to Unlimited
            </Button>
        </div>
        <div className="flex items-center gap-3">
            <UserButton />
            <Button variant={"ghost"}>Settings</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}