'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import moment from 'moment';
import { useGetCustomersQuery } from '@/redux/features/customers/customerApi';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  vehicles: string[];
}

export default function CustomerDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { 
    data: customers = { data: [], pagination: { total: 0, totalPages: 0 } }, 
    isLoading, 
    error, 
    refetch 
  } = useGetCustomersQuery({
    search: searchTerm,
    page,
    limit
  });

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

  return (
    <main>
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-800">Customer Directory</CardTitle>
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
                placeholder="Search by name, email, phone or vehicle..."
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
            
            {customers.pagination.total > 0 && (
              <div className="text-sm text-orange-700">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, customers.pagination.total)} of {customers.pagination.total} entries
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load customers. Please try again.
        </div>
      )}

      {isLoading ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-orange-800">Customer</TableHead>
                <TableHead className="text-orange-800">Contact</TableHead>
                <TableHead className="text-orange-800">Vehicles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
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
                  <TableHead className="text-orange-800">Customer</TableHead>
                  <TableHead className="text-orange-800">Contact</TableHead>
                  <TableHead className="text-orange-800">Vehicles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="text-orange-500">No customers found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.data.map((customer: CustomerData, index: number) => (
                    <TableRow key={index} className="hover:bg-orange-50/50">
                      <TableCell>
                        <div className="font-medium text-orange-900">{customer.name}</div>
                      </TableCell>
                      <TableCell className='flex flex-col'>
                        <a className="text-sm text-orange-700" href={`mailto:${customer?.email}`}>{customer.email}</a>
                        <a className="text-sm text-orange-600" href={`tel:${customer?.phone}`}>{customer.phone}</a>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.vehicles.map((vehicle, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="mr-2 mb-2 border-orange-200 text-orange-700 bg-orange-50"
                            >
                              {vehicle}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {customers.pagination.totalPages > 1 && (
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
              
              {Array.from({ length: Math.min(5, customers.pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (customers.pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= customers.pagination.totalPages - 2) {
                  pageNum = customers.pagination.totalPages - 4 + i;
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
                disabled={page === customers.pagination.totalPages || isLoading}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => goToPage(customers.pagination.totalPages)}
                disabled={page === customers.pagination.totalPages || isLoading}
              >
                <ChevronDoubleRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}