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

interface Service {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  basePrice: number;
}

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

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  const goToPage = (newPage: number) => {
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

  return (
    <main className="p-4 md:p-6">
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-800">Service List</CardTitle>
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
                placeholder="Search services by name..."
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
            
            {services.pagination.total > 0 && (
              <div className="text-sm text-orange-700">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, services.pagination.total)} of {services.pagination.total} entries
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load services. Please try again.
        </div>
      )}

      {isLoading ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Added</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Skeleton className="h-9 w-9 rounded-md" />
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
                  <TableHead className="text-orange-800">Date Added</TableHead>
                  <TableHead className="text-orange-800">Name</TableHead>
                  <TableHead className="text-orange-800">Base Price</TableHead>
                  <TableHead className="text-right text-orange-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="text-orange-500">No services found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  services.data.map((service: Service) => (
                    <TableRow key={service._id} className="hover:bg-orange-50/50">
                      <TableCell className="whitespace-nowrap text-orange-900">
                        {moment(service.createdAt).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell className="text-orange-900 font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell className="text-orange-900">
                        ${service.basePrice}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {services.pagination.totalPages > 1 && (
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
              
              {Array.from({ length: Math.min(5, services.pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (services.pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= services.pagination.totalPages - 2) {
                  pageNum = services.pagination.totalPages - 4 + i;
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
                disabled={page === services.pagination.totalPages || isLoading}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => goToPage(services.pagination.totalPages)}
                disabled={page === services.pagination.totalPages || isLoading}
              >
                <ChevronDoubleRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

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
              <span className="text-sm">Created: {moment(currentService?.createdAt).format("MMMM D, YYYY")}</span>
              <span className="text-sm font-medium">Base Price: ${currentService?.basePrice.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-orange-100 pt-4">
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