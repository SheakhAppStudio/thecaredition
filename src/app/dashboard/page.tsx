// app/dashboard/page.tsx
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
import moment from 'moment';
import axios from 'axios';

interface DashboardStats {
  totalBookings: number;
  newBookings: number;
  completedBookings: number;
  waitingResponse: number;
  cancelledBookings: number;
  totalCustomers: number;
  recentBookings: BookingData[];
}

interface BookingData {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    registrationNumber: string;
    make: string;
    model: string;
  };
  services: {
    name: string;
    basePrice: number;
  }[];
  totalPrice: number;
  otherService: string;
  status: string;
  createdAt?: string;
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
  cancelledBookings: 0,
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
      const bookingsRes = await axios.get('/api/filter-dashboard');
      const bookingsData = bookingsRes.data;
      
      const recentBookings = bookingsData.data.map((booking: any) => ({
        id: booking._id.toString(),
        ...booking
      }));

      const newRequests = bookingsData.data
        .filter((b: any) => 
          (b.status?.toLowerCase() === 'new request') &&
          new Date(b.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        )
        .map((booking: any) => ({
          id: booking._id.toString(),
          timestamp: booking.createdAt,
          customerName: booking.customer?.name || 'Unknown Customer',
          registrationNumber: booking.vehicle?.registrationNumber || 'N/A',
          service: booking.services?.[0]?.name || 'Service Request',
          isNew: true
        }));

      setNotifications(newRequests);
      setUnreadCount(newRequests.length);

      setStats({
        totalBookings: bookingsData.data.length,
        newBookings: bookingsData.totalNewRequest,
        completedBookings: bookingsData.totalCompleted,
        waitingResponse: bookingsData.totalWaitingResponse,
        cancelledBookings: bookingsData.totalCancelledJons,
        totalCustomers: 0,
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
      title: 'Cancelled Jobs',
      value: stats.cancelledBookings,
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      borderColor: 'border-red-100',
      link: '/dashboard/bookings/cancelled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'new request':
        return 'bg-amber-50 text-amber-700 border border-amber-200 font-medium';
      case 'contacted':
      case 'waiting response':
        return 'bg-blue-50 text-blue-700 border border-blue-200 font-medium';
      case 'waiting':
        return 'bg-purple-50 text-purple-700 border border-purple-200 font-medium';
      case 'booked':
        return 'bg-green-50 text-green-700 border border-green-200 font-medium';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium';
      case 'cancelled':
      case 'cancelled jobs':
        return 'bg-red-50 text-red-700 border border-red-200 font-medium';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 font-medium';
    }
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your business operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative inline-flex items-center p-2 sm:px-3 sm:py-2 text-gray-700 hover:text-gray-900 focus:outline-none">
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs items-center justify-center">
                    {unreadCount}
                  </span>
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
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
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="">Refresh</span>
          </button>
          
          <Link
            href="/dashboard/bookings/service-estimator"
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <span className="hidden sm:inline">Add New Booking</span>
            <span className="sm:hidden">New Booking</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Welcome to Car Edition Pro</h2>
            <p className="text-sm sm:text-base text-gray-600">Manage your service bookings and customer data efficiently</p>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {statCards.map((card, index) => (
              <Link 
                key={index}
                href={card.link}
                className={`bg-white rounded-lg sm:rounded-xl border ${card.borderColor} hover:shadow-md sm:hover:shadow-lg transition-all duration-200 ease-in-out group`}
              >
                <div className="p-3 sm:p-4 md:p-5">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
                    <div className={`${card.color} rounded-lg p-2 sm:p-3 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                      <card.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{card.value}</span>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                    <span>View details</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 gap-2 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link 
                href="/dashboard/bookings/new" 
                className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium flex items-center group"
              >
                View All
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] sm:min-w-0">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 sm:px-6 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <InboxIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
                          <p className="text-sm">No recent bookings found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    stats?.recentBookings?.map((booking) => (
                      <tr key={booking?._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {moment(booking?.createdAt).format("DD MMM YYYY")}
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 flex flex-col">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{booking?.vehicle?.registrationNumber}</span>
                          <span className="text-xs text-gray-500">{booking?.vehicle?.make}</span>
                          <span className="text-xs text-gray-500">{booking?.vehicle?.model}</span>
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{booking?.customer?.name}</div>
                          <div className="text-xs text-gray-500">{booking?.customer?.email}</div>
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4">
                          {booking?.services?.map((service, i) => (
                            <div key={i} className="text-xs sm:text-sm text-gray-900">
                              {service.name} <span className="text-gray-600">(£{service?.basePrice?.toFixed(2)})</span>
                            </div>
                          ))}
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 sm:px-3 sm:py-1 text-xxs sm:text-xs rounded-full ${getStatusColor(booking?.status)}`}>
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
  );
}