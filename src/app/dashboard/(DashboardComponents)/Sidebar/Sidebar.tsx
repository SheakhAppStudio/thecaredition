"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Users,
  Calendar,
  FilePlus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  Film,
  BookOpen,
  Settings,
  ChevronDown,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const navSections = [
    {
      title: "Services Management",
      icon: <Users className="h-5 w-5 text-amber-500" />,
      items: [
        { href: "/dashboard/add-services", icon: <Users className="h-4 w-4" />, name: "Add Service" },
        { href: "/dashboard/services-list", icon: <Users className="h-4 w-4" />, name: "Services List" },
      ]
    },
    {
      title: "Customers Management",
      icon: <Users className="h-5 w-5 text-amber-500" />,
      items: [
        { href: "/dashboard/customer-directory", icon: <Users className="h-4 w-4" />, name: "Customer Directory" },
      ]
    },
    {
      title: "Booking Management",
      icon: <Calendar className="h-5 w-5 text-amber-500" />,
      items: [
        { href: '/dashboard/bookings/new', icon: <FilePlus className="h-4 w-4" />, name: 'New Requests' },
        { href: '/dashboard/bookings/booked-services', icon: <CheckCircle2 className="h-4 w-4" />, name: 'Booked Services' },
        { href: '/dashboard/bookings/waiting-response', icon: <Clock className="h-4 w-4" />, name: 'Waiting Response' },
        { href: '/dashboard/bookings/completed', icon: <CheckCircle2 className="h-4 w-4" />, name: 'Completed' },
        { href: '/dashboard/bookings/cancelled-jobs', icon: <XCircle className="h-4 w-4" />, name: 'Cancelled Jobs' },
      ]
    },
    {
      title: "Shop Management",
      icon: <BookOpen className="h-5 w-5 text-amber-500" />,
      items: [
        { href: '/dashboard/add-shop', icon: <FilePlus className="h-4 w-4" />, name: 'Add Shop' },
        { href: '/dashboard/shop-list', icon: <FileText className="h-4 w-4" />, name: 'Shop List' },
      ]
    },
    {
      title: "Blog Management",
      icon: <BookOpen className="h-5 w-5 text-amber-500" />,
      items: [
        { href: '/dashboard/add-blog', icon: <FilePlus className="h-4 w-4" />, name: 'Add Blog' },
        { href: '/dashboard/blog-list', icon: <FileText className="h-4 w-4" />, name: 'Blog List' },
      ]
    },
    {
      title: "Video Management",
      icon: <Film className="h-5 w-5 text-amber-500" />,
      items: [
        { href: '/dashboard/add-video', icon: <Video className="h-4 w-4" />, name: 'Add Video' },
        { href: '/dashboard/video-list', icon: <Film className="h-4 w-4" />, name: 'Video List' },
      ]
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5 text-amber-500" />,
      items: [
        { href: '/dashboard/settings', icon: <Settings className="h-4 w-4" />, name: 'System Settings' },
      ]
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-full flex-col bg-black border-r border-gray-800 lg:w-72 w-64">
      {/* Header */}
      <div className="flex h-20 items-center justify-center border-b border-gray-800 px-4">
        <Link href={"/"} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
            <span className="font-bold text-black">CE</span>
          </div>
          <span className="text-xl font-bold text-white">Car Edition Pro</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Dashboard Button */}
        <div>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              isActive('/dashboard')
                ? "bg-amber-500 text-black font-medium"
                : "text-white hover:bg-amber-500/10 hover:text-amber-500"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </div>

        {/* Existing Navigation Sections */}
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-amber-500 font-medium">
              {section.icon}
              <span>{section.title}</span>
            </div>
            <div className="space-y-1 ml-8 pl-2 border-l border-gray-800">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isActive(item.href) 
                      ? "bg-amber-500/10 text-amber-500 border-l-2 border-amber-500" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-800 p-4">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={async () => {
            await signOut({ redirect: false, callbackUrl: "/" });
            router.push("/");
            router.refresh();
          }}
        >
          <Image 
            src={session?.user?.profilePhoto || '/default-avatar.png'} 
            width={40} 
            height={40} 
            alt='profile pic' 
            className="h-10 w-10 rounded-full border-2 border-amber-500"
            priority
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{session?.user?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-400">{session?.user?.email || 'admin@caredition.pro'}</p>
          </div>
          <LogOut className="h-5 w-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
        </div>
      </div>
    </div>
  );
}