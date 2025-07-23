'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'react-toastify';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowPathIcon,
  CheckIcon,
  PrinterIcon
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
import { Badge } from "@/components/ui/badge";
import { SearchInput } from '@/components/reuseableComponents/Tables/reuseableHeader';
import { DataTable } from '@/components/reuseableComponents/Tables/reuseableTable';
import { Pagination } from '@/components/reuseableComponents/Tables/reuseablePagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  confirmedPrice: number;
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

type ColumnDef<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
};

export default function NewBookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
  const [newStatus, setNewStatus] = useState('New Request');
 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isUpdating, setIsUpdating] = useState(false);
  const printWindowRef = useRef<Window | null>(null);

  const { 
    data: bookings = { data: [], pagination: { total: 0, totalPages: 0 } }, 
    isLoading, 
    error, 
    refetch 
  } = useGetBookingsQuery({
    search: searchTerm, 
    status: 'Waiting Response',
    page,
    limit
  });
 
  console.log('Bookings:', bookings);
console.log(bookings)
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
 const [confirmedPrice, setConfirmedPrice] = useState(0);
  const statusOptions = ['New Request', 'Waiting Response', 'Booked Services', 'Completed', 'Cancelled Jobs'];

  const updateStatus = async () => {
    if (!currentBooking) return;
    
    try {
      setIsUpdating(true);
      await updateBookingStatus({ 
        id: currentBooking._id, 
        status: newStatus ,
        confirmedPrice: confirmedPrice
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

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const handlePrint = (booking: BookingData) => {
    if (printWindowRef.current) {
      printWindowRef.current.close();
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      toast.error('Popup was blocked. Please allow popups for this site.');
      return;
    }

    printWindowRef.current = printWindow;

    printWindow.document.write(`
      <html>
        <head>
          <title>Service Receipt - ${booking.vehicle.registrationNumber}</title>
          <style>
            @page { size: auto; margin: 5mm; }
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 14px; }
            h1 { color: #333; text-align: center; margin: 10px 0; font-size: 22px; }
            h2 { font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .business-name { font-size: 24px; font-weight: bold; color: #ea580c; margin-bottom: 5px; }
            .receipt-title { font-size: 18px; margin: 10px 0; color: #333; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .mt-4 { margin-top: 20px; }
            .py-2 { padding-top: 10px; padding-bottom: 10px; }
            .border-t { border-top: 1px solid #ddd; }
            .total-row { font-weight: bold; font-size: 16px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="business-name">Car Edition Pro</div>
            <div class="receipt-title">Service Receipt</div>
            <div>Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
          
          <div>
            <h2>Customer Information</h2>
            <p><strong>${booking.customer.name}</strong></p>
            <p>Phone: ${booking.customer.phone}</p>
            <p>Email: ${booking.customer.email}</p>
          </div>
          
          <div class="mt-4">
            <h2>Vehicle Information</h2>
            <p><strong>${booking.vehicle.make} ${booking.vehicle.model}</strong></p>
            <p>Registration: ${booking.vehicle.registrationNumber}</p>
          </div>
          
          <div class="mt-4">
            <h2>Services</h2>
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th class="text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                ${booking.services.map(service => `
                  <tr>
                    <td>${service.name}</td>
                    <td class="text-right">£${service.basePrice.toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td class="text-right">${booking.otherService}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 border-t py-2">
            <table>
              <tr class="total-row">
              <td><strong>Total</strong></td>
                <td class="text-right"><strong>£${booking.totalPrice.toFixed(2)}</strong></td>
                <td><strong>Confirm Price</strong></td>
                <td class="text-right"><strong>£${Number(booking.confirmedPrice).toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>
          
          <div class="mt-4">
            <h2>Status</h2>
            <p><strong>${booking.status}</strong></p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Car Edition Pro</p>
            <p>For any questions, please contact us at: contact@infinityauto.com</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  useEffect(() => {
    return () => {
      if (printWindowRef.current) {
        printWindowRef.current.close();
      }
    };
  }, []);

  const columns: ColumnDef<BookingData>[] = [
    {
      header: "Date",
      accessor: (booking) => moment(booking.createdAt).format("DD MMM YYYY"),
      cellClassName: "whitespace-nowrap text-orange-900"
    },
    {
      header: "Customer",
      accessor: (booking) => (
        <div>
          <div className="font-medium text-orange-900">{booking.customer.name}</div>
          <div className="text-sm text-orange-700">{booking.customer.phone}</div>
          <div className="text-sm text-orange-600">{booking.customer.email}</div>
        </div>
      )
    },
    {
      header: "Vehicle",
      accessor: (booking) => (
        <div>
          <div className="font-medium text-orange-900">
            {booking.vehicle.make} {booking.vehicle.model}
          </div>
          <div className="text-sm text-orange-700">
            {booking.vehicle.registrationNumber}
          </div>
        </div>
      )
    },
    {
      header: "Services",
      accessor: (booking) => (
        <div className="space-y-1">
          {booking.services.map((service, i) => (
            <div key={i} className="text-sm text-orange-900">
              {service.name} <span className="text-orange-600">(£{service.basePrice.toFixed(2)})</span>
            </div>
          ))}
              {booking.otherService && (
            <div className="text-sm text-orange-900">
              Other Service: <span className="text-orange-600">{booking.otherService}</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: "Price",
      accessor: (booking) => `£${booking.totalPrice.toFixed(2)}`,
      cellClassName: "text-right font-medium text-orange-900"
    },
    {
      header: "Confirmed Price",
      accessor: (booking) => `£${Number(booking.confirmedPrice).toFixed(2) || 0}`,
      cellClassName: "text-right font-medium text-orange-900"
    },
    {
      header: "Status",
      accessor: (booking) => (
        <Badge className={`${statusColors[booking.status]} transition-colors`}>
          {booking.status}
        </Badge>
      )
    },
    {
      header: "Actions",
      accessor: (booking) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="icon"
            className="text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
            onClick={() => handlePrint(booking)}
          >
            <PrinterIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-orange-600 border-orange-200 hover:bg-orange-100 hover:text-orange-700"
            onClick={() => {
              setCurrentBooking(booking);
              setConfirmedPrice(booking.confirmedPrice || 0);
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
      ),
      cellClassName: "text-right"
    }
  ];

  return (
    <main>
  
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        heading="New Requests"
        onSubmit={handleSearch}
        isLoading={isLoading}
        limit={limit}
        onLimitChange={handleLimitChange}
        pagination={{
          page: page,
          total: Array.isArray(bookings) ? 0 : bookings.pagination.total
        }}
        placeholder="Search by customer, vehicle, or service..."
      />

      <DataTable<BookingData>
        columns={columns}
        data={!Array.isArray(bookings) && Array.isArray(bookings?.data) ? bookings.data : []}
        isLoading={isLoading}
        error={
          error
            ? typeof error === "string"
              ? error
              : "status" in (error as any)
                ? `Error: ${(error as any).status}`
                : "An error occurred"
            : undefined
        }
        emptyMessage="No bookings found"
        skeletonCount={5}
      />

      <Pagination
        currentPage={page}
        totalPages={!Array.isArray(bookings) ? bookings.pagination.totalPages : 0}
        onPageChange={goToPage}
        isLoading={isLoading}
      />

      {/* Status Update Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="border-orange-200 max-w-md">
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

      {/* New Price Confirmation Field */}
      <div>
        <label className="block text-sm font-medium mb-2 text-orange-700">
          Confirm Price 
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            defaultValue={confirmedPrice}
            onChange={(e) => setConfirmedPrice(Number(e.target.value))}
            placeholder={`Enter confirm price `}
            className="pl-8 w-full rounded-md border border-orange-200 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
    </div>
    
    <DialogFooter>
      <Button 
        variant="outline" 
        className="border-orange-200 text-orange-700 hover:bg-orange-50"
        onClick={() => {
          setIsModalOpen(false);
          setConfirmedPrice(0);
        }}
      >
        Cancel
      </Button>
      <Button 
        onClick={updateStatus}
        className="bg-orange-600 hover:bg-orange-700"
        disabled={isUpdating || !newStatus || !confirmedPrice || isNaN(confirmedPrice) }
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