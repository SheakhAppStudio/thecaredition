'use client'

import { ChevronDown, Menu, Settings, LogOut } from 'lucide-react'
import { useSidebar } from '@/context/sidebar-context'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export function Header() {
  const { toggleMobileSidebar } = useSidebar()
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-black px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileSidebar}
          className="flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-amber-500 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center">
            <span className="font-bold text-black text-xs">CE</span>
          </div>
          <span className="text-lg font-semibold text-white">Car Edition Pro</span>
        </div>
      </div>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image 
                src={session?.user?.profilePhoto || '/default-avatar.png'} 
                width={32} 
                height={32} 
                alt="Profile picture"
                className="rounded-full border-2 border-amber-500 object-cover w-full h-full"
                priority
              />
            </div>
            
            <div className="hidden md:flex flex-col items-start ml-2 mr-1">
              <p className="text-sm font-medium text-white leading-tight line-clamp-1 max-w-[160px]">
                {session?.user?.name}
              </p>
              <p className="text-xs text-amber-400 capitalize leading-tight">
                {session?.user?.role === 'ins super admin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
            
            <ChevronDown className="hidden md:block h-4 w-4 text-amber-400" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="w-56 bg-gray-900 border border-gray-700 text-white shadow-lg" 
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-amber-400 capitalize">
                  {session?.user?.role === 'ins super admin' ? 'Super Admin' : 'Admin'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-gray-700" />
            
            <DropdownMenuItem 
              onClick={() => router.push(`/dashboard/settings/${session?.user?.id}`)}
              className="px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-amber-500 focus:bg-gray-800 focus:text-amber-500 cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-gray-700" />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="px-3 py-2 text-red-400 hover:bg-gray-800 hover:text-red-500 focus:bg-gray-800 focus:text-red-500 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}