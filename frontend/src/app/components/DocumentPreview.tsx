import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DocumentPreviewProps {
  fileName: string;
  totalPages: number;
}

export function DocumentPreview({ fileName, totalPages }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">{fileName}</p>
          <p className="text-xs text-neutral-500">{totalPages} pages</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-neutral-700 min-w-[4rem] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="relative bg-neutral-100 rounded-xl overflow-hidden aspect-[3/4] max-h-[60vh] md:max-h-none">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Mock preview with page content */}
          <div className="w-[85%] h-[90%] bg-white shadow-md rounded-sm p-4 flex flex-col">
            <div className="space-y-2">
              <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-3 bg-neutral-200 rounded w-full"></div>
              <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
              <div className="h-3 bg-neutral-200 rounded w-full"></div>
              <div className="h-3 bg-neutral-200 rounded w-4/5"></div>
            </div>
            <div className="mt-auto text-center">
              <p className="text-xs text-neutral-400">Page {currentPage}</p>
            </div>
          </div>
        </div>

        {/* Swipe indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i + 1 === currentPage ? 'w-6 bg-red-500' : 'w-1 bg-neutral-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
