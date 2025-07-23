'use client';

import { useState } from 'react';
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
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import moment from "moment";
import { useDeleteServiceMutation, useGetServicesQuery } from "@/redux/features/service/serviceApi";
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
import Link from 'next/link';
import { SearchInput } from '@/components/reuseableComponents/Tables/reuseableHeader';
import { DataTable } from '@/components/reuseableComponents/Tables/reuseableTable';
import { Pagination } from '@/components/reuseableComponents/Tables/reuseablePagination';

interface Service {
  _id: string;
  name: string;
  description: string;

  basePrice: number;
}

type ColumnDef<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
};



export default function ServiceManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { 
    data: services = { data: [], pagination: { total: 0, totalPages: 0 } }, 
    isLoading, 
    error, 
    refetch 
  } = useGetServicesQuery({
    search: searchTerm,
    page,
    limit
  }, { refetchOnMountOrArgChange: true });

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleDeleteService = async () => {
    if (!currentService) return;
    
    try {
      const res = await deleteService(currentService._id).unwrap();
      if(res?.deletedCount > 0){
        toast.success('Service deleted successfully');
        refetch();
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      toast.error('Failed to delete service');
      console.error('Delete error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleLimitChange = (value: number) => {
    console.log('Changing limit to:', value);
    setLimit(value);
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    console.log('Navigating to page:', newPage);
    setPage(newPage);
  };

  const openDeleteDialog = (service: Service) => {
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };

  const openDescriptionDialog = (service: Service) => {
    setCurrentService(service);
    setIsDescriptionDialogOpen(true);
  };
const columns: ColumnDef<Service>[] = [
  {
    header: "Name",
    accessor: (service) => service.name,
  },
  {
    header: "Description",
    accessor: (service) => (
      <span className="truncate block max-w-xs">{service.description}</span>
    ),
  },
  {
    header: "Base Price",
    accessor: (service) => `$${service.basePrice.toFixed(2)}`,
  },

  {
    header: "Actions",
    accessor: (service) => (
    <div className="flex gap-2 justify-left">
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-orange-600 border-orange-200 hover:bg-orange-100 hover:text-orange-700"
                            onClick={() => openDescriptionDialog(service)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Link href={`/dashboard/services-list/${service._id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                            onClick={() => openDeleteDialog(service)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            ) : (
                              <TrashIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
    ),
  },
];
  return (
    <main >
     <SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  heading="Service List"
  onSubmit={handleSearch}
  isLoading={isLoading}
  limit={limit}
  onLimitChange={handleLimitChange}
  pagination={{
    page: page,
    total: services.pagination.total
  }}
/>



     <DataTable<Service>
  columns={columns}
  data={services.data}
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
  emptyMessage="No services found"
  skeletonCount={5}

/>
<Pagination
  currentPage={page}
  totalPages={services.pagination.totalPages}
  onPageChange={goToPage}
  isLoading={isLoading}
/>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-orange-800">Delete Service</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-orange-700">Are you sure you want to delete the service "{currentService?.name}"?</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteService}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Service'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Description Preview Dialog */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogContent className="border-orange-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-orange-800">{currentService?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between text-orange-700">
              <span className="text-sm font-medium">Base Price: ${currentService?.basePrice.toFixed(2)}</span>
            </div>
            
            <div >
              <h3 className="text-lg font-medium text-orange-800 mb-2">Description:</h3>
              <p className="text-orange-900 whitespace-pre-line">
                {currentService?.description}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => setIsDescriptionDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}


