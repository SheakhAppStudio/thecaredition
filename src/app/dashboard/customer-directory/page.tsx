'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'react-toastify';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import moment from 'moment';
import {  useGetCustomersQuery } from '@/redux/features/customers/customerApi';

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

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  
  return (
    <main >
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h1 className="text-xl font-bold mb-2">Customer Directory</h1>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
            ) : (
              <>
                <ArrowPathIcon className="h-5 w-5" />
                Search
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border rounded-md px-2 py-1 text-sm"
              disabled={isLoading}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          
          {customers.pagination.total > 0 && (
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, customers.pagination.total)} of {customers.pagination.total} entries
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load customers. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow mb-4">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
          
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.data.map((customer : any) => (
                    <tr key={customer._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4">
                        {customer.phone}
                      </td>
             
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {customers.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => goToPage(1)}
                disabled={page === 1 || isLoading}
                className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDoubleLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1 || isLoading}
                className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
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
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-md ${
                      page === pageNum 
                        ? 'bg-blue-500 text-white' 
                        : 'border hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === customers.pagination.totalPages || isLoading}
                className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => goToPage(customers.pagination.totalPages)}
                disabled={page === customers.pagination.totalPages || isLoading}
                className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDoubleRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}