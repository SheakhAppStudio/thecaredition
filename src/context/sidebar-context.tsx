'use client'

import { createContext, useContext, useState } from 'react'

type SidebarContextType = {
  isMobileSidebarOpen: boolean
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  expandedItems: Record<string, boolean>
  toggleItem: (key: string) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    course: false,
    batch: false,
    admission: false,
    generalAccount: false,
    fees: false,
    instructor: false,
    studentAttendance: false,
    otherLinks: false,
  })

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev)
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <SidebarContext.Provider
      value={{
        isMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        expandedItems,
        toggleItem,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}