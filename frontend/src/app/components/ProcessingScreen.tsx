import { CheckCircle2, Printer, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ProcessingScreenProps {
  jobId: string;
  onComplete: () => void;
}

type ProcessingStage = 'payment' | 'sending' | 'printing' | 'complete';

export function ProcessingScreen({ jobId, onComplete }: ProcessingScreenProps) {
  const [stage, setStage] = useState<ProcessingStage>('payment');

  useEffect(() => {
  const fetchStatus = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/print/jobs/${jobId}/fetchStatus`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("atp_token")}`,
          },
        }
      );

      console.log("Fetching status for job ID:", jobId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      const backendStatus = data.status;

      // Map backend → UI stage
      const statusMap: Record<string, ProcessingStage> = {
        uploaded: "payment",
        queued: "sending",
        printing: "printing",
        completed: "complete",
      };

      const newStage = statusMap[backendStatus];
      
      console.log("Backend status:", backendStatus);
      
      if (newStage) {
        setStage(newStage);
      }

      if (backendStatus === "completed") {
        onComplete();
      }

    } catch (err) {
      console.error("Status polling error:", err);
    }
  };

  fetchStatus();

  const interval = setInterval(fetchStatus, 3000);

  return () => clearInterval(interval);

}, [jobId, onComplete]);


  const stages = [
    { id: 'payment', label: 'Payment Confirmed', icon: CheckCircle2, color: 'text-green-500' },
    { id: 'sending', label: 'Sending Job to Printer', icon: Send, color: 'text-blue-500' },
    { id: 'printing', label: 'Printing in Progress', icon: Printer, color: 'text-orange-500' },
    { id: 'complete', label: 'Print Completed', icon: CheckCircle2, color: 'text-green-500' },
  ];

  const currentIndex = stages.findIndex(s => s.id === stage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-neutral-900">
      <div className="w-full max-w-md">
        {/* Animated Circle */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="relative w-32 h-32"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {/* Rotating circle */}
            <motion.div
              className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                key={stage}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {(() => {
                  const Icon = stages[currentIndex].icon;
                  return <Icon className={`w-16 h-16 ${stages[currentIndex].color}`} />;
                })()}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="space-y-4">
            {stages.map((s, index) => {
              const Icon = s.icon;
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-red-50' : isCompleted ? 'bg-green-50' : 'bg-neutral-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-red-500 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-neutral-200 text-neutral-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`font-medium ${
                      isActive || isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Reassurance Text */}
        <motion.p
          className="text-center text-neutral-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Please wait while your document is being printed
        </motion.p>
      </div>
    </div>
  );
}
