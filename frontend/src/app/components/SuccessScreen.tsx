import { CheckCircle2, Download, Share2, RotateCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';

interface SuccessScreenProps {
  jobId: string;
  printerLocation: string;
  pages: number;
  copies: number;
  totalCost: number;
  onNewPrint: () => void;
}

export function SuccessScreen({
  jobId,
  printerLocation,
  pages,
  copies,
  totalCost,
  onNewPrint,
}: SuccessScreenProps) {
  const currentDate = new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownloadReceipt = () => {
    // Mock download functionality
    alert('Receipt downloaded');
  };

  const handleShareReceipt = () => {
    // Mock share functionality
    alert('Receipt shared');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-neutral-900">
      <div className="w-full max-w-md">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white text-center mb-2"
        >
          Print Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-neutral-400 text-center mb-8"
        >
          Your document is ready for collection
        </motion.p>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="border-b border-dashed border-neutral-300 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 text-center">
              Digital Receipt
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Job ID</span>
                <span className="font-mono font-semibold text-neutral-900">{jobId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Printer Location</span>
                <span className="font-medium text-neutral-900">{printerLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Pages</span>
                <span className="font-medium text-neutral-900">{pages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Copies</span>
                <span className="font-medium text-neutral-900">{copies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Date & Time</span>
                <span className="font-medium text-neutral-900 text-sm">{currentDate}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold text-neutral-700">Total Paid</span>
            <span className="text-2xl font-bold text-green-600">₹{totalCost}</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            onClick={onNewPrint}
            className="w-full bg-red-500 hover:bg-red-600 text-white h-14 text-lg font-semibold rounded-xl shadow-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Make Another Print
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="h-12 rounded-xl border-2"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShareReceipt}
              variant="outline"
              className="h-12 rounded-xl border-2"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-neutral-500 mt-6"
        >
          Please collect your printout from {printerLocation}
        </motion.p>
      </div>
    </div>
  );
}
