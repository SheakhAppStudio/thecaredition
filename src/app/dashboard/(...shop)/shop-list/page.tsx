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
import { useDeleteShopMutation, useGetShopsQuery } from "@/redux/features/shops/shopApi";
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
import Image from 'next/image';

interface Shop {
  _id: string;
  title: string;
  createdAt: string;
  content: string;
  imageUrls: string[];
}

export default function ShopManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { 
    data: shops = { data: [], pagination: { total: 0, totalPages: 0 } }, 
    isLoading, 
    error, 
    refetch 
  } = useGetShopsQuery({
    search: searchTerm,
    page,
    limit
  },{refetchOnMountOrArgChange : true});

  const [deleteShop, { isLoading: isDeleting }] = useDeleteShopMutation();

  const handleDeleteShop = async () => {
    if (!currentShop) return;
    
    try {
      const res = await deleteShop(currentShop._id).unwrap();
      if(res?.deletedCount > 0){
        toast.success('Shop deleted successfully');
        refetch();
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      toast.error('Failed to delete shop');
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

  const openDeleteDialog = (shop: Shop) => {
    setCurrentShop(shop);
    setIsDeleteDialogOpen(true);
  };

  const openContentDialog = (shop: Shop) => {
    setCurrentShop(shop);
    setIsContentDialogOpen(true);
  };

  const openImageDialog = (shop: Shop, index = 0) => {
    setCurrentShop(shop);
    setCurrentImageIndex(index);
    setIsImageDialogOpen(true);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!currentShop) return;
    
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + currentShop.imageUrls.length) % currentShop.imageUrls.length
      : (currentImageIndex + 1) % currentShop.imageUrls.length;
    
    setCurrentImageIndex(newIndex);
  };

  return (
    <main className="p-4 md:p-6">
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-800">Shop List</CardTitle>
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
                placeholder="Search shops by title..."
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
            
            {shops.pagination.total > 0 && (
              <div className="text-sm text-orange-700">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, shops.pagination.total)} of {shops.pagination.total} entries
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load shops. Please try again.
        </div>
      )}

      {isLoading ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Added</TableHead>
                <TableHead>Thumbnails</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-16 w-16 rounded" />
                      <Skeleton className="h-16 w-16 rounded" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
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
                  <TableHead className="text-orange-800">Thumbnails</TableHead>
                  <TableHead className="text-orange-800">Title</TableHead>
                  <TableHead className="text-right text-orange-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="text-orange-500">No shops found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  shops.data.map((shop: Shop) => (
                    <TableRow key={shop._id} className="hover:bg-orange-50/50">
                      <TableCell className="whitespace-nowrap text-orange-900">
                        {moment(shop.createdAt).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {shop.imageUrls.slice(0, 2).map((imageUrl, index) => (
                            <div 
                              key={index}
                              className="relative h-16 w-16 rounded-md border border-orange-100 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                              onClick={() => openImageDialog(shop, index)}
                            >
                              <Image
                                src={imageUrl} 
                                alt={`${shop.title} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {index === 1 && shop.imageUrls.length > 2 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    +{shop.imageUrls.length - 2}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-orange-900 font-medium">
                        {shop.title}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-orange-600 border-orange-200 hover:bg-orange-100 hover:text-orange-700"
                            onClick={() => openContentDialog(shop)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Link href={`/dashboard/shop-list/${shop._id}`}>
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
                            onClick={() => openDeleteDialog(shop)}
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

          {shops.pagination.totalPages > 1 && (
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
              
              {Array.from({ length: Math.min(5, shops.pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (shops.pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= shops.pagination.totalPages - 2) {
                  pageNum = shops.pagination.totalPages - 4 + i;
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
                disabled={page === shops.pagination.totalPages || isLoading}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => goToPage(shops.pagination.totalPages)}
                disabled={page === shops.pagination.totalPages || isLoading}
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
            <DialogTitle className="text-orange-800">Delete Shop</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-orange-700">Are you sure you want to delete the shop "{currentShop?.title}"?</p>
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
              onClick={handleDeleteShop}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Shop'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Preview Dialog */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="border-orange-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-orange-800">{currentShop?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentShop?.imageUrls.map((imageUrl, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-orange-100">
                  <Image
                    src={imageUrl}
                    alt={`${currentShop.title} image ${index + 1}`}
                    fill
                    className="object-cover"
                    onClick={() => {
                      openImageDialog(currentShop, index);
                      setIsContentDialogOpen(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-orange-700">
              <span className="text-sm">Posted on: {moment(currentShop?.createdAt).format("MMMM D, YYYY")}</span>
            </div>
            
            <div 
              className="prose max-w-none text-orange-900 mt-4"
              dangerouslySetInnerHTML={{ __html: currentShop?.content || '' }}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => setIsContentDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="border-orange-200 max-w-4xl p-0 bg-transparent">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full"
              onClick={() => navigateImage('prev')}
              disabled={!currentShop || currentShop.imageUrls.length <= 1}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full"
              onClick={() => setIsImageDialogOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-16 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full"
              onClick={() => navigateImage('next')}
              disabled={!currentShop || currentShop.imageUrls.length <= 1}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
            {currentShop && (
              <>
                <div className="aspect-video w-full flex items-center justify-center bg-gray-100">
                  <Image
                    src={currentShop.imageUrls[currentImageIndex]}
                    alt={`${currentShop.title} image ${currentImageIndex + 1}`}
                    width={1200}
                    height={675}
                    className="object-contain max-w-full max-h-[80vh]"
                    priority
                  />
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {currentShop.imageUrls.length}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}