import { Button } from '@/app/components/ui/button';
import { IndianRupee } from 'lucide-react';

interface StickyBottomBarProps {
  totalCost: number;
  pages: number;
  copies: number;
  disabled: boolean;
  onPayClick: () => void;
}

export function StickyBottomBar({ totalCost, pages, copies, disabled, onPayClick }: StickyBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-neutral-200 shadow-2xl p-4 md:p-6 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span>{pages} pages</span>
            <span>•</span>
            <span>{copies} {copies === 1 ? 'copy' : 'copies'}</span>
          </div>
          <div className="flex items-center gap-1 text-2xl font-bold text-neutral-900">
            <IndianRupee className="w-6 h-6" />
            {totalCost}
          </div>
        </div>
        <Button
          onClick={onPayClick}
          disabled={disabled}
          className="w-full bg-red-500 hover:bg-red-600 text-white h-14 text-lg font-semibold rounded-xl shadow-lg disabled:bg-neutral-300 disabled:cursor-not-allowed"
        >
          Pay & Print
        </Button>
      </div>
    </div>
  );
}
