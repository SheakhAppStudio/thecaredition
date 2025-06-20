'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useDeleteBookingMutation, useGetBookingsQuery, useUpdateBookingStatusMutation } from "@/redux/features/bookings/bookingApi";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  status: string;
  createdAt?: string;
}

const statusColors: Record<string, string> = {
  'New Request': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'Waiting Response': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  'Booked Services': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'Completed': 'bg-green-100 text-green-800 hover:bg-green-200',
  'Cancelled Jobs': 'bg-red-100 text-red-800 hover:bg-red-200',
};

export default function NewBookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
  const [newStatus, setNewStatus] = useState('New Request');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { 
    data: bookings = { data: [], pagination: { total: 0, totalPages: 0 } }, 
    isLoading, 
    error, 
    refetch 
  } = useGetBookingsQuery({
    search: searchTerm, 
    status: 'New Request',
    page,
    limit
  });

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const statusOptions = ['New Request', 'Waiting Response', 'Booked Services', 'Completed', 'Cancelled Jobs'];

  const updateStatus = async () => {
    if (!currentBooking) return;
    
    try {
      setIsUpdating(true);
      await updateBookingStatus({ 
        id: currentBooking._id, 
        status: newStatus 
      }).unwrap();
      
      toast.success('Status updated successfully');
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id).unwrap();
        toast.success('Booking deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete booking');
        console.error('Delete error:', error);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (error) {
      toast.error('Failed to load bookings');
      console.error('API Error:', error);
    }
  }, [error]);

  return (
    <main>
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-800">New Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-orange-400" />
              </div>
              <Input
                type="text"
                className="pl-10 border-orange-200 focus:border-orange-400"
                placeholder="Search by customer, vehicle, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-orange-700">Show:</span>
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-[80px] border-orange-200">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-orange-700">entries</span>
            </div>
            
            {bookings.pagination.total > 0 && (
              <div className="text-sm text-orange-700">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, bookings.pagination.total)} of {bookings.pagination.total} entries
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load bookings. Please try again.
        </div>
      )}

      {isLoading ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-40 mt-1" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <>
          <Card className="border-orange-100">
            <Table>
              <TableHeader className="bg-orange-50">
                <TableRow>
                  <TableHead className="text-orange-800">Date</TableHead>
                  <TableHead className="text-orange-800">Customer</TableHead>
                  <TableHead className="text-orange-800">Vehicle</TableHead>
                  <TableHead className="text-orange-800">Services</TableHead>
                  <TableHead className="text-right text-orange-800">Price</TableHead>
                  <TableHead className="text-orange-800">Status</TableHead>
                  <TableHead className="text-right text-orange-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-orange-500">No bookings found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.data.map((booking: BookingData) => (
                    <TableRow key={booking._id} className="hover:bg-orange-50/50">
                      <TableCell className="whitespace-nowrap text-orange-900">
                        {moment(booking.createdAt).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-orange-900">{booking.customer.name}</div>
                        <div className="text-sm text-orange-700">{booking.customer.phone}</div>
                        <div className="text-sm text-orange-600">{booking.customer.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-orange-900">
                          {booking.vehicle.make} {booking.vehicle.model}
                        </div>
                        <div className="text-sm text-orange-700">
                          {booking.vehicle.registrationNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {booking.services.map((service, i) => (
                            <div key={i} className="text-sm text-orange-900">
                              {service.name} <span className="text-orange-600">(£{service.basePrice.toFixed(2)})</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-orange-900">
                        £{booking.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[booking.status]} transition-colors`}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-orange-600 border-orange-200 hover:bg-orange-100 hover:text-orange-700"
                            onClick={() => {
                              setCurrentBooking(booking);
                              setNewStatus(booking.status);
                              setIsModalOpen(true);
                            }}
                            disabled={isLoading}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleDeleteBooking(booking._id)}
                            disabled={isLoading || isDeleting}
                          >
                            {isDeleting ? (
                              <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            ) : (
                              <TrashIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {bookings.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => goToPage(1)}
                disabled={page === 1 || isLoading}
              >
                <ChevronDoubleLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: Math.min(5, bookings.pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (bookings.pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= bookings.pagination.totalPages - 2) {
                  pageNum = bookings.pagination.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    className={`${
                      page === pageNum 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                    } w-10 h-10`}
                    onClick={() => goToPage(pageNum)}
                    disabled={isLoading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => goToPage(page + 1)}
                disabled={page === bookings.pagination.totalPages || isLoading}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => goToPage(bookings.pagination.totalPages)}
                disabled={page === bookings.pagination.totalPages || isLoading}
              >
                <ChevronDoubleRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Status Update Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-orange-800">Update Booking Status</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-orange-700">Current Status</label>
              <Badge className={`${statusColors[currentBooking?.status || '']} px-3 py-1`}>
                {currentBooking?.status}
              </Badge>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-orange-700">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="border-orange-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${
                          status === 'New Request' ? 'bg-blue-500' :
                          status === 'Waiting Response' ? 'bg-yellow-500' :
                          status === 'Booked Services' ? 'bg-purple-500' :
                          status === 'Completed' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-orange-800">{status}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={updateStatus}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Update Status
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}