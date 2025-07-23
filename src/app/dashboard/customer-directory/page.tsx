'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useGetCustomersQuery } from '@/redux/features/customers/customerApi';
import {
  Card,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/reuseableComponents/Tables/reuseableHeader';
import { DataTable } from '@/components/reuseableComponents/Tables/reuseableTable';
import { Pagination } from '@/components/reuseableComponents/Tables/reuseablePagination';
import moment from 'moment';

interface Vehicle {
  registrationNumber: string;
  make: string;
  model: string;
  color: string;
  fuelType: string;
  engineCapacity: number;
  yearOfManufacture: number;
  // Add other vehicle properties as needed
}

interface CustomerData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
  createdAt?: string;
}

type ColumnDef<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
};

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

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const columns: ColumnDef<CustomerData>[] = [
    {
      header: "Customer",
      accessor: (customer) => (
        <div>
          <div className="font-medium text-orange-900">{customer.name}</div>
          <div className="text-sm text-orange-700">
            {customer.createdAt && `Joined: ${moment(customer.createdAt).format("DD MMM YYYY")}`}
          </div>
        </div>
      )
    },
    {
      header: "Contact",
      accessor: (customer) => (
        <div className="flex flex-col">
          <a className="text-sm text-orange-700 hover:underline" href={`mailto:${customer.email}`}>
            {customer.email}
          </a>
          <a className="text-sm text-orange-600 hover:underline" href={`tel:${customer.phone}`}>
            {customer.phone}
          </a>
        </div>
      )
    },
    {
      header: "Vehicles",
      accessor: (customer) => (
        <div className="space-y-2">
          {customer.vehicles.map((vehicle, i) => (
            <div key={i} className="p-2 border rounded-lg border-orange-100 bg-orange-50">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono border-orange-200 text-orange-700 bg-orange-100">
                  {vehicle.registrationNumber}
                </Badge>
                <span className="text-sm font-medium text-orange-800">
                  {vehicle.make} {vehicle.model}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-orange-600">
                <div>Year: {vehicle.yearOfManufacture}</div>
                <div>Fuel: {vehicle.fuelType}</div>
                <div>Color: {vehicle.color}</div>
                <div>Engine: {vehicle.engineCapacity}cc</div>
              </div>
            </div>
          ))}
        </div>
      ),
      cellClassName: "min-w-[300px]"
    }
  ];

  return (
    <main>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        heading="Customer Directory"
        onSubmit={handleSearch}
        isLoading={isLoading}
        limit={limit}
        onLimitChange={handleLimitChange}
        pagination={{
          page: page,
          total: customers.pagination.total
        }}
        placeholder="Search by name, email, phone or vehicle..."
      />

      <DataTable<CustomerData>
        columns={columns}
        data={customers.data}
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
        emptyMessage="No customers found"
        skeletonCount={5}
      />

      <Pagination
        currentPage={page}
        totalPages={customers.pagination.totalPages}
        onPageChange={goToPage}
        isLoading={isLoading}
      />
    </main>
  );
}