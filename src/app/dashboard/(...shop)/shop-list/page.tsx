'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import moment from "moment";
import { useDeleteShopMutation, useGetShopsQuery } from "@/redux/features/shops/shopApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from 'next/link';
import Image from 'next/image';
import { SearchInput } from '@/components/reuseableComponents/Tables/reuseableHeader';
import { DataTable } from '@/components/reuseableComponents/Tables/reuseableTable';
import { Pagination } from '@/components/reuseableComponents/Tables/reuseablePagination';
import { Button } from '@/components/ui/button';

interface Shop {
  _id: string;
  title: string;
  createdAt: string;
  content: string;
  imageUrls: string[];
}

type ColumnDef<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
};

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
  }, { refetchOnMountOrArgChange: true });
console.log(shops)
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

  const handleLimitChange = (value: number) => {
    setLimit(value);
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

  const columns: ColumnDef<Shop>[] = [
    {
      header: "Date Added",
      accessor: (shop) => moment(shop.createdAt).format("DD MMM YYYY"),
      cellClassName: "whitespace-nowrap"
    },
    {
      header: "Thumbnails",
      accessor: (shop) => (
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
      )
    },
    {
      header: "Title",
      accessor: (shop) => shop.title,
      cellClassName: "font-medium"
    },
    {
      header: "Actions",
      accessor: (shop) => (
        <div className="flex gap-2 justify-left">
          <button
            className="p-2 text-orange-600 border border-orange-200 rounded-md hover:bg-orange-100 hover:text-orange-700"
            onClick={() => openContentDialog(shop)}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <Link href={`/dashboard/shop-list/${shop._id}`}>
            <button
              className="p-2 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </Link>
          <button
            className="p-2 text-red-600 border border-red-200 rounded-md hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
            onClick={() => openDeleteDialog(shop)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </button>
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
        heading="Shop List"
        onSubmit={handleSearch}
        isLoading={isLoading}
        limit={limit}
        onLimitChange={handleLimitChange}
        pagination={{
          page: page,
          total: shops.pagination.total
        }}
      />

      <DataTable<Shop>
        columns={columns}
        data={shops.data}
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
        emptyMessage="No shops found"
        skeletonCount={5}
      />

      <Pagination
        currentPage={page}
        totalPages={shops.pagination.totalPages}
        onPageChange={goToPage}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Shop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the shop "{currentShop?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentShop?.title}</DialogTitle>
            <DialogDescription>
              Posted on: {moment(currentShop?.createdAt).format("MMMM D, YYYY")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {currentShop?.imageUrls.map((imageUrl, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-lg overflow-hidden border border-orange-100 cursor-pointer"
                onClick={() => {
                  openImageDialog(currentShop, index);
                  setIsContentDialogOpen(false);
                }}
              >
                <Image
                  src={imageUrl}
                  alt={`${currentShop.title} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div 
            className="prose max-w-none text-orange-900"
            dangerouslySetInnerHTML={{ __html: currentShop?.content || '' }}
          />
          <DialogFooter>
            <Button onClick={() => setIsContentDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          <div className="relative">
            {currentShop && (
              <>
                <button
                  className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2"
                  onClick={() => navigateImage('prev')}
                  disabled={currentShop.imageUrls.length <= 1}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2"
                  onClick={() => setIsImageDialogOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <button
                  className="absolute top-4 right-16 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2"
                  onClick={() => navigateImage('next')}
                  disabled={currentShop.imageUrls.length <= 1}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
                
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