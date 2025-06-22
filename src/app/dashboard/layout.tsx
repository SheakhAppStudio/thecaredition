import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SidebarProvider } from '@/context/sidebar-context'
import '@/app/globals.css'
import { DashboardLayout } from './(DashboardComponents)/DashboardLayout/DashboardLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Modern dashboard with sidebar navigation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
 
      <div className={`${inter.className} bg-gray-50 text-gray-900`}>
        <SidebarProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </SidebarProvider>
      </div>
   
  )
}