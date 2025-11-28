import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import AppHeader from "./_components/AppHeader"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <AppHeader />
        <div className="p-5">
         {children}

        </div>
      </main>
    </SidebarProvider>
  )
}