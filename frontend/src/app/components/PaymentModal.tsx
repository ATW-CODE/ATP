import { X, CreditCard, IndianRupee } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCost: number;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, totalCost, onPaymentSuccess }: PaymentModalProps) {
  if (!isOpen) return null;

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Amount */}
          <div className="bg-red-50 rounded-xl p-6 mb-6 text-center">
            <p className="text-sm text-neutral-600 mb-2">Total Amount</p>
            <div className="flex items-center justify-center gap-2">
              <IndianRupee className="w-8 h-8 text-red-500" />
              <span className="text-5xl font-bold text-neutral-900">{totalCost}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-6">
            <p className="text-sm text-neutral-600 text-center">
              Your print job will start automatically after payment confirmation
            </p>
          </div>

          {/* Payment Options - Mock UI */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center gap-4 p-4 border-2 border-neutral-200 rounded-xl hover:border-red-500 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-neutral-900">UPI</p>
                <p className="text-xs text-neutral-500">PhonePe, Google Pay, Paytm</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 border-2 border-neutral-200 rounded-xl hover:border-red-500 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-neutral-900">Card</p>
                <p className="text-xs text-neutral-500">Credit or Debit Card</p>
              </div>
            </button>
          </div>

          {/* Demo Payment Button */}
          <Button
            onClick={handlePayment}
            className="w-full bg-red-500 hover:bg-red-600 text-white h-14 text-lg font-semibold rounded-xl"
          >
            Proceed to Pay
          </Button>

          <p className="text-xs text-neutral-500 text-center mt-4">
            🔒 Secured payment gateway
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
