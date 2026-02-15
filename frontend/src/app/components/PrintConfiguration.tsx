import { Printer, Minus, Plus, FileText, Palette, FileType, ChevronDown } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { useState } from 'react';

interface Printer {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'busy' | 'offline';
  supportsColor: boolean;
}

interface PrintConfigurationProps {
  printers: Printer[];
  selectedPrinter: string | null;
  onSelectPrinter: (id: string) => void;
  copies: number;
  onCopiesChange: (copies: number) => void;
  orientation: 'portrait' | 'landscape';
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
  pageRange: string;
  onPageRangeChange: (range: string) => void;
  colorMode: 'bw' | 'color';
  onColorModeChange: (mode: 'bw' | 'color') => void;
  paperSize: string;
  onPaperSizeChange: (size: string) => void;
}

export function PrintConfiguration({
  printers,
  selectedPrinter,
  onSelectPrinter,
  copies,
  onCopiesChange,
  orientation,
  onOrientationChange,
  pageRange,
  onPageRangeChange,
  colorMode,
  onColorModeChange,
  paperSize,
  onPaperSizeChange,
}: PrintConfigurationProps) {
  const [showPrinters, setShowPrinters] = useState(false);
  const [showCustomPages, setShowCustomPages] = useState(false);
  const selectedPrinterData = printers.find(p => p.id === selectedPrinter);
  const colorDisabled = selectedPrinterData ? !selectedPrinterData.supportsColor : true;

  return (
    <div className="space-y-4 mt-40 md:mt-0">
      {/* Printer Selection */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
          <Printer className="w-4 h-4" />
          Printer
        </label>
        <button
          onClick={() => setShowPrinters(!showPrinters)}
          className="w-full flex items-center justify-between p-3 border-2 border-neutral-200 rounded-lg hover:border-red-500 transition-colors"
        >
          {selectedPrinterData ? (
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="font-medium text-neutral-900">{selectedPrinterData.name}</p>
                <p className="text-xs text-neutral-500">{selectedPrinterData.location}</p>
              </div>
              <Badge
                variant={selectedPrinterData.status === 'online' ? 'default' : 'secondary'}
                className={selectedPrinterData.status === 'online' ? 'bg-green-500' : ''}
              >
                {selectedPrinterData.status}
              </Badge>
            </div>
          ) : (
            <span className="text-neutral-500">Select Printer</span>
          )}
          <ChevronDown className={`w-5 h-5 transition-transform ${showPrinters ? 'rotate-180' : ''}`} />
        </button>

        {showPrinters && (
          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
            {printers.map(printer => (
              <button
                key={printer.id}
                onClick={() => {
                  if (printer.status !== 'offline') {
                    onSelectPrinter(printer.id);
                    setShowPrinters(false);
                  }
                }}
                disabled={printer.status === 'offline'}
                className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all ${
                  printer.status === 'offline'
                    ? 'opacity-50 cursor-not-allowed bg-neutral-50'
                    : selectedPrinter === printer.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-neutral-200 hover:border-red-300'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium text-neutral-900">{printer.name}</p>
                  <p className="text-xs text-neutral-500">{printer.location}</p>
                </div>
                <Badge
                  variant={printer.status === 'online' ? 'default' : 'secondary'}
                  className={printer.status === 'online' ? 'bg-green-500' : ''}
                >
                  {printer.status}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Copies */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
          <FileText className="w-4 h-4" />
          Copies
        </label>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => onCopiesChange(Math.max(1, copies - 1))}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-2xl font-bold text-neutral-900 w-16 text-center">{copies}</span>
          <button
            onClick={() => onCopiesChange(Math.min(99, copies + 1))}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Orientation */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
          <FileType className="w-4 h-4" />
          Orientation
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onOrientationChange('portrait')}
            className={`p-4 rounded-lg border-2 transition-all ${
              orientation === 'portrait'
                ? 'border-red-500 bg-red-50'
                : 'border-neutral-200 hover:border-red-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-16 rounded border-2 ${
                orientation === 'portrait' ? 'border-red-500 bg-white' : 'border-neutral-400 bg-neutral-100'
              }`}></div>
              <span className="text-sm font-medium">Portrait</span>
            </div>
          </button>
          <button
            onClick={() => onOrientationChange('landscape')}
            className={`p-4 rounded-lg border-2 transition-all ${
              orientation === 'landscape'
                ? 'border-red-500 bg-red-50'
                : 'border-neutral-200 hover:border-red-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-12 rounded border-2 ${
                orientation === 'landscape' ? 'border-red-500 bg-white' : 'border-neutral-400 bg-neutral-100'
              }`}></div>
              <span className="text-sm font-medium">Landscape</span>
            </div>
          </button>
        </div>
      </div>

      {/* Pages */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
          <FileText className="w-4 h-4" />
          Pages
        </label>
        <button
          onClick={() => setShowCustomPages(!showCustomPages)}
          className="w-full p-3 border-2 border-neutral-200 rounded-lg hover:border-red-500 transition-colors text-left"
        >
          {pageRange === 'all' ? 'All Pages' : `Custom: ${pageRange}`}
        </button>
        {showCustomPages && (
          <div className="mt-3">
            <input
              type="text"
              value={pageRange === 'all' ? '' : pageRange}
              onChange={(e) => onPageRangeChange(e.target.value || 'all')}
              placeholder="e.g. 1-3, 6"
              className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-red-500 focus:outline-none"
            />
            <p className="mt-2 text-xs text-neutral-500">Enter page numbers or ranges (e.g., 1-3, 6)</p>
          </div>
        )}
      </div>

      {/* Color Mode */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
          <Palette className="w-4 h-4" />
          Color Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onColorModeChange('bw')}
            className={`p-4 rounded-lg border-2 transition-all ${
              colorMode === 'bw'
                ? 'border-red-500 bg-red-50'
                : 'border-neutral-200 hover:border-red-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-black rounded"></div>
                <div className="w-4 h-4 bg-neutral-300 rounded"></div>
              </div>
              <span className="text-sm font-medium">Black & White</span>
            </div>
          </button>
          <button
            onClick={() => !colorDisabled && onColorModeChange('color')}
            disabled={colorDisabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              colorDisabled
                ? 'opacity-50 cursor-not-allowed bg-neutral-50'
                : colorMode === 'color'
                ? 'border-red-500 bg-red-50'
                : 'border-neutral-200 hover:border-red-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
              </div>
              <span className="text-sm font-medium">Color</span>
            </div>
          </button>
        </div>
        {colorDisabled && (
          <p className="mt-2 text-xs text-neutral-500">Color printing not available for selected printer</p>
        )}
      </div>

      {/* Paper Size */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
          <FileType className="w-4 h-4" />
          Paper Size
        </label>
        <select
          value={paperSize}
          onChange={(e) => onPaperSizeChange(e.target.value)}
          className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-red-500 focus:outline-none bg-white"
        >
          <option value="A4">A4 (210 × 297 mm)</option>
          <option value="Letter" disabled>Letter (8.5 × 11 in)</option>
          <option value="Legal" disabled>Legal (8.5 × 14 in)</option>
          <option value="A3" disabled>A3 (297 × 420 mm)</option>
        </select>
      </div>
    </div>
  );
}
