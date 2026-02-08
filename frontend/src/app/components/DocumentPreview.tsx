import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface DocumentPreviewProps {
  file: File;
}

export function DocumentPreview({ file }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-neutral-500">
            {totalPages || "…"} pages
          </p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-medium text-neutral-700 min-w-[4rem] text-center">
            {currentPage} / {totalPages || "—"}
          </span>

          <button
            onClick={() =>
              setCurrentPage(p => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="bg-neutral-100 rounded-xl overflow-hidden flex justify-center py-2 max-h-[60vh]">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
          loading={<p className="text-sm text-neutral-500">Loading preview…</p>}
        >
          <Page
            pageNumber={currentPage}
            width={320}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}
