// components/reusable/Pagination.tsx
import { Button } from "@/components/ui/button";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon 
} from "@heroicons/react/24/outline";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        variant="outline"
        size="icon"
        className="border-orange-200 text-orange-700 hover:bg-orange-50"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronDoubleLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="border-orange-200 text-orange-700 hover:bg-orange-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }
        
        return (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            className={`${
              currentPage === pageNum 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'border-orange-200 text-orange-700 hover:bg-orange-50'
            } w-10 h-10`}
            onClick={() => onPageChange(pageNum)}
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="border-orange-200 text-orange-700 hover:bg-orange-50"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
      >
        <ChevronDoubleRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};