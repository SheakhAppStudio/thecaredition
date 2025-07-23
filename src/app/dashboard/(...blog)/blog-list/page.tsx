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
import { useDeleteBlogMutation, useGetBlogsQuery } from "@/redux/features/blogs/blogApi";
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

interface Blog {
  _id: string;
  title: string;
  createdAt: string;
  content: string;
  imageUrl: string;
}

type ColumnDef<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
};

export default function BlogManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { 
    data: blogs = { data: [], pagination: { total: 0, totalPages: 0 } }, 
    isLoading, 
    error, 
    refetch 
  } = useGetBlogsQuery({
    search: searchTerm,
    page,
    limit
  }, { refetchOnMountOrArgChange: true });

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const handleDeleteBlog = async () => {
    if (!currentBlog) return;
    
    try {
      const res = await deleteBlog(currentBlog._id).unwrap();
      if(res?.deletedCount > 0){
        toast.success('Blog deleted successfully');
        refetch();
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      toast.error('Failed to delete blog');
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

  const openDeleteDialog = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsDeleteDialogOpen(true);
  };

  const openContentDialog = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsContentDialogOpen(true);
  };

  const openImageDialog = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsImageDialogOpen(true);
  };

  const columns: ColumnDef<Blog>[] = [
    {
      header: "Date Added",
      accessor: (blog) => moment(blog.createdAt).format("DD MMM YYYY"),
      cellClassName: "whitespace-nowrap text-orange-900"
    },
    {
      header: "Thumbnail",
      accessor: (blog) => (
        <div 
          className="h-16 w-24 object-cover rounded border border-orange-100 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => openImageDialog(blog)}
        >
          <Image
            src={blog.imageUrl || ""} 
            alt={blog.title}
            width={96}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
      )
    },
    {
      header: "Title",
      accessor: (blog) => blog.title,
      cellClassName: "text-orange-900 font-medium"
    },
    {
      header: "Actions",
      accessor: (blog) => (
        <div className="flex gap-2 justify-left">
          <button
            className="p-2 text-orange-600 border border-orange-200 rounded-md hover:bg-orange-100 hover:text-orange-700"
            onClick={() => openContentDialog(blog)}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <Link href={`/dashboard/blog-list/${blog._id}`}>
            <button
              className="p-2 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </Link>
          <button
            className="p-2 text-red-600 border border-red-200 rounded-md hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
            onClick={() => openDeleteDialog(blog)}
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
        heading="Blog Posts"
        onSubmit={handleSearch}
        isLoading={isLoading}
        limit={limit}
        onLimitChange={handleLimitChange}
        pagination={{
          page: page,
          total: blogs.pagination.total
        }}
      />

      <DataTable<Blog>
        columns={columns}
        data={blogs.data}
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
        emptyMessage="No blogs found"
        skeletonCount={5}
      />

      <Pagination
        currentPage={page}
        totalPages={blogs.pagination.totalPages}
        onPageChange={goToPage}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Blog</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the blog "{currentBlog?.title}"? This action cannot be undone.
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
              onClick={handleDeleteBlog}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Blog'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Preview Dialog */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentBlog?.title}</DialogTitle>
            <DialogDescription>
              Posted on: {moment(currentBlog?.createdAt).format("MMMM D, YYYY")}
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-orange-100 my-4">
            <Image
              src={currentBlog?.imageUrl || ''}
              alt={currentBlog?.title || 'Blog thumbnail'}
              fill
              className="object-cover"
            />
          </div>
          <div 
            className="prose max-w-none text-orange-900"
            dangerouslySetInnerHTML={{ __html: currentBlog?.content || '' }}
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
            <button
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2"
              onClick={() => setIsImageDialogOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="aspect-video w-full flex items-center justify-center bg-gray-100">
              {currentBlog && (
                <Image
                  src={currentBlog.imageUrl}
                  alt={currentBlog.title}
                  width={1200}
                  height={675}
                  className="object-contain max-w-full max-h-[80vh]"
                  priority
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}