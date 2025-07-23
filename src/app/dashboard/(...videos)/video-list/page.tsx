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
import { useDeleteVideoMutation, useGetVideosQuery } from "@/redux/features/videos/videoApi";
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
import { FaYoutube } from 'react-icons/fa';

interface YouTubeVideo {
  _id: string;
  title: string;
  createdAt: string;
  description: string;
  videoYoutubeLink: string;
  videoThumbnail: string;
  videoEmbedLink?: string;
}

type ColumnDef<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
};

export default function YouTubeVideosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { 
    data: videos = { data: [], pagination: { total: 0, totalPages: 0 } }, 
    isLoading, 
    error, 
    refetch 
  } = useGetVideosQuery({
    search: searchTerm,
    page,
    limit
  }, { refetchOnMountOrArgChange: true });

  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();

  const handleDeleteVideo = async () => {
    if (!currentVideo) return;
    
    try {
      const result = await deleteVideo(currentVideo._id).unwrap();
      if(result?.deletedCount > 0) {
        toast.success('Video deleted successfully');
        refetch();
        setIsDeleteDialogOpen(false);
      } else {
        toast.error('Video not found or already deleted');
      }
    } catch (error) {
      toast.error('Failed to delete video');
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

  const openDeleteDialog = (video: YouTubeVideo) => {
    setCurrentVideo(video);
    setIsDeleteDialogOpen(true);
  };

  const openContentDialog = (video: YouTubeVideo) => {
    setCurrentVideo(video);
    setIsContentDialogOpen(true);
  };

  const openImageDialog = (video: YouTubeVideo) => {
    setCurrentVideo(video);
    setIsImageDialogOpen(true);
  };

  const columns: ColumnDef<YouTubeVideo>[] = [
    {
      header: "Date Added",
      accessor: (video) => moment(video.createdAt).format("DD MMM YYYY"),
      cellClassName: "whitespace-nowrap text-orange-900"
    },
    {
      header: "Thumbnail",
      accessor: (video) => (
        <div 
          className="h-16 w-24 object-cover rounded border border-orange-100 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => openImageDialog(video)}
        >
          <Image
            src={video.videoThumbnail} 
            alt={video.title}
            width={96}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
      )
    },
    {
      header: "Title",
      accessor: (video) => video.title,
      cellClassName: "text-orange-900 font-medium"
    },
    {
      header: "Actions",
      accessor: (video) => (
        <div className="flex gap-2 justify-left">
          <button
            className="p-2 text-orange-600 border border-orange-200 rounded-md hover:bg-orange-100 hover:text-orange-700"
            onClick={() => openContentDialog(video)}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <Link href={`/dashboard/video-list/${video._id}`}>
            <button
              className="p-2 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </Link>
          <button
            className="p-2 text-red-600 border border-red-200 rounded-md hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
            onClick={() => openDeleteDialog(video)}
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
        heading="YouTube Videos"
        onSubmit={handleSearch}
        isLoading={isLoading}
        limit={limit}
        onLimitChange={handleLimitChange}
        pagination={{
          page: page,
          total: videos.pagination.total
        }}
      />

      <DataTable<YouTubeVideo>
        columns={columns}
        data={videos.data}
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
        emptyMessage="No videos found"
        skeletonCount={5}
      />

      <Pagination
        currentPage={page}
        totalPages={videos.pagination.totalPages}
        onPageChange={goToPage}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Video</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the video "{currentVideo?.title}"? This action cannot be undone.
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
              onClick={handleDeleteVideo}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Video'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Preview Dialog */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentVideo?.title}</DialogTitle>
            <DialogDescription>
              Posted on: {moment(currentVideo?.createdAt).format("MMMM D, YYYY")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-orange-100">
              <Image
                src={currentVideo?.videoThumbnail || ''}
                alt={currentVideo?.title || 'Video thumbnail'}
                fill
                className="object-cover"
              />
            </div>
            
            {currentVideo?.videoYoutubeLink && (
              <div className="mt-4">
                <a 
                  href={currentVideo.videoYoutubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-600 hover:text-orange-800"
                >
                  <FaYoutube className="mr-2 text-xl" />
                  Watch on YouTube
                </a>
              </div>
            )}
            
            <div className="prose max-w-none text-orange-900 mt-4">
              {currentVideo?.description}
            </div>
          </div>
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
            
            {currentVideo && (
              <div className="aspect-video w-full flex items-center justify-center bg-gray-100">
                <Image
                  src={currentVideo.videoThumbnail}
                  alt={currentVideo.title}
                  width={1200}
                  height={675}
                  className="object-contain max-w-full max-h-[80vh]"
                  priority
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}