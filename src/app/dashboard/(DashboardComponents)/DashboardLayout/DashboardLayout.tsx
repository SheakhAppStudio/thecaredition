'use client'

import { Sidebar } from '../Sidebar/Sidebar'
import { Header } from '../Header/Header'
import { useSidebar } from '@/context/sidebar-context'
import { cn } from '@/lib/utils'


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isMobileSidebarOpen, closeMobileSidebar } = useSidebar()


  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={cn(
        "fixed z-40 h-screen w-64 border-r bg-firstColor text-white transition-transform duration-300",
        "md:hidden",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </aside>

      {/* Desktop Sidebar (fixed) */}
      <aside className="hidden h-screen lg:w-72 w-64 border-r bg-firstColor text-white md:fixed md:block">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden md:pl-64 bg-fifthColor">
        {/* Fixed Header - positioned at top of content area */}
        <header className="sticky top-0 z-30 h-16 border-b bg-firstColor lg:hidden">
          <Header />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-20 bg-light-orange-gradient ">
          {children}
        </main>
      </div>
    </div>
  )
}