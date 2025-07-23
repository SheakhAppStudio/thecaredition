// components/SearchInput.jsx
import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  heading: string;
  onSubmit?: (e: React.FormEvent) => void;
  isLoading?: boolean;
  limit?: number;
  onLimitChange?: (value: number) => void;
  pagination?: {
    total: number;
    page: number;
  };
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search services by name...", 
  heading,
  onSubmit,
  isLoading = false,
  limit = 10,
  onLimitChange,
  pagination
}) => {
  const handleLimitChange = (value: string) => {
    onLimitChange?.(parseInt(value));
  };

  return (
   <div className="mb-6 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
  <div className="p-6">
    <h3 className="text-2xl font-bold text-black">{heading}</h3>
  </div>

  <div className="px-6 pb-6">
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          className="w-full pl-10 px-4 py-2 rounded-lg border border-orange-200 focus:border-orange-400 focus:outline-none text-black"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      
      {onSubmit && (
        <button 
          type="submit" 
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {isLoading ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Search
            </>
          )}
        </button>
      )}
    </form>

    {(onLimitChange || pagination) && (
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-black">Show:</span>
            <select 
              value={limit.toString()} 
              onChange={(e) => handleLimitChange(e.target.value)}
              className="w-[80px] border border-orange-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 text-black"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-black">entries</span>
          </div>
        )}
        
        {pagination?.total && pagination.total > 0 && (
          <div className="text-sm text-black">
            Showing {((pagination.page - 1) * limit) + 1} to {Math.min(pagination.page * limit, pagination.total)} of {pagination.total} entries
          </div>
        )}
      </div>
    )}
  </div>
</div>
  );
};

export { SearchInput };