'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'react-toastify';
import { 
  UserGroupIcon, 
  CheckCircleIcon,
  ClockIcon,
  InboxIcon,
  ArrowPathIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardStats {
  totalBookings: number;
  newBookings: number;
  completedBookings: number;
  waitingResponse: number;
  totalCustomers: number;
  recentBookings: Array<{
    id: string;
    timestamp: string;
    carRegistration: string;
    name: string;
    email: string;
    vehicleMake: string;
    vehicleModel: string;
    status: string;
  }>;
}

interface Notification {
  id: string;
  timestamp: string;
  customerName: string;
  registrationNumber: string;
  service: string;
  isNew: boolean;
}

const initialStats: DashboardStats = {
  totalBookings: 0,
  newBookings: 0,
  completedBookings: 0,
  waitingResponse: 0,
  totalCustomers: 0,
  recentBookings: []
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const bookingsRes = await fetch('/api/bookings');
      const bookings = await bookingsRes.json();
      
      const customersRes = await fetch('/api/customers');
      const customers = await customersRes.json();

      // Transform new requests into notifications
      const newRequests = bookings
        .filter((b: any) => 
          (b.status?.toLowerCase() === 'new' || b.status?.toLowerCase() === 'new request') &&
          new Date(b.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        )
        .map((booking: any) => ({
          id: booking._id,
          timestamp: booking.createdAt,
          customerName: booking.customer?.name || 'Unknown Customer',
          registrationNumber: booking.vehicle?.registrationNumber || 'N/A',
          service: booking.services?.[0]?.name || 'Service Request',
          isNew: true
        }));

      setNotifications(newRequests);
      setUnreadCount(newRequests.length);

      const newCount = bookings.filter((b: any) => 
        b.status?.toLowerCase() === 'new' || b.status?.toLowerCase() === 'new request'
      ).length;
      
      const completedCount = bookings.filter((b: any) => 
        b.status?.toLowerCase() === 'completed'
      ).length;
      
      const waitingCount = bookings.filter((b: any) => 
        b.status?.toLowerCase() === 'waiting' || b.status?.toLowerCase() === 'contacted'
      ).length;

      const recentBookings = bookings.slice(0, 5).map((booking: any) => ({
        id: booking._id,
        timestamp: booking.createdAt,
        carRegistration: booking.vehicle?.registrationNumber || 'N/A',
        name: booking.customer?.name || 'N/A',
        email: booking.customer?.email || 'N/A',
        vehicleMake: booking.vehicle?.make || 'N/A',
        vehicleModel: booking.vehicle?.model || 'N/A',
        status: booking.status || 'New'
      }));

      setStats({
        totalBookings: bookings.length,
        newBookings: newCount,
        completedBookings: completedCount,
        waitingResponse: waitingCount,
        totalCustomers: customers.data?.length || 0,
        recentBookings
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'New Requests',
      value: stats.newBookings,
      icon: InboxIcon,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      borderColor: 'border-orange-100',
      link: '/dashboard/bookings/new'
    },
    {
      title: 'Waiting Response',
      value: stats.waitingResponse,
      icon: ClockIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      borderColor: 'border-blue-100',
      link: '/dashboard/bookings/waiting-response'
    },
    {
      title: 'Completed Jobs',
      value: stats.completedBookings,
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      borderColor: 'border-emerald-100',
      link: '/dashboard/bookings/completed'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: UserGroupIcon,
      color: 'bg-gradient-to-br from-violet-500 to-violet-600',
      borderColor: 'border-violet-100',
      link: '/dashboard/customer-directory'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'new request':
        return 'bg-amber-50 text-amber-700 border border-amber-200 font-medium';
      case 'contacted':
        return 'bg-blue-50 text-blue-700 border border-blue-200 font-medium';
      case 'waiting':
        return 'bg-purple-50 text-purple-700 border border-purple-200 font-medium';
      case 'booked':
        return 'bg-green-50 text-green-700 border border-green-200 font-medium';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200 font-medium';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 font-medium';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your business operations</p>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="relative inline-flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">New Requests</h3>
                  <p className="text-xs text-gray-500 mt-1">Recent service requests from customers</p>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <InboxIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm">No new requests</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="focus:bg-gray-50 cursor-pointer">
                        <Link href={`/dashboard/bookings/new`} className="px-4 py-3 flex flex-col w-full">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.customerName}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.service} - {notification.registrationNumber}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatNotificationDate(notification.timestamp)}
                            </span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-100">
                    <Link 
                      href="/dashboard/bookings/new"
                      className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center justify-center w-full"
                    >
                      View All New Requests
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Car Edition Pro</h2>
              <p className="text-gray-600">Manage your service bookings and customer data efficiently</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, index) => (
                <Link 
                  key={index}
                  href={card.link}
                  className={`bg-white rounded-xl border ${card.borderColor} hover:shadow-lg transition-all duration-200 ease-in-out group`}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`${card.color} rounded-lg p-3 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                        <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                      <span>View details</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <Link 
                  href="/dashboard/bookings/new" 
                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center group"
                >
                  View All
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recentBookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <InboxIcon className="h-8 w-8 text-gray-400 mb-2" />
                            <p>No recent bookings found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      stats.recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(booking.timestamp)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">{booking.carRegistration}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                            <div className="text-xs text-gray-500">{booking.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{booking.vehicleMake} {booking.vehicleModel}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
