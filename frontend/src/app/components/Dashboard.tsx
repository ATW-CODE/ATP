import { Printer, FileText, Clock, IndianRupee, TrendingUp, CheckCircle2, LayoutGrid, Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { motion } from 'motion/react';

interface DashboardProps {
  onNewPrint: () => void;
  userName: string;
}

interface PrintJob {
  id: string;
  fileName: string;
  pages: number;
  copies: number;
  cost: number;
  status: 'completed' | 'processing' | 'failed';
  timestamp: string;
  printerLocation: string;
}

interface PrinterStatus {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'busy' | 'offline';
  queueCount: number;
}

// Mock data
const mockPrintHistory: PrintJob[] = [
  {
    id: 'ATP846291',
    fileName: 'Presentation_Final.pdf',
    pages: 8,
    copies: 2,
    cost: 24,
    status: 'completed',
    timestamp: '2 hours ago',
    printerLocation: 'Ground Floor - Counter 1',
  },
  {
    id: 'ATP846145',
    fileName: 'Resume_Updated.pdf',
    pages: 2,
    copies: 5,
    cost: 15,
    status: 'completed',
    timestamp: '5 hours ago',
    printerLocation: 'Ground Floor - Counter 2',
  },
  {
    id: 'ATP845932',
    fileName: 'Project_Report.docx',
    pages: 15,
    copies: 1,
    cost: 23,
    status: 'completed',
    timestamp: 'Yesterday',
    printerLocation: 'First Floor - Counter 3',
  },
  {
    id: 'ATP845721',
    fileName: 'Invoice_Jan2026.pdf',
    pages: 3,
    copies: 1,
    cost: 5,
    status: 'completed',
    timestamp: '2 days ago',
    printerLocation: 'Ground Floor - Counter 1',
  },
];

const mockPrinters: PrinterStatus[] = [
  {
    id: '1',
    name: 'HP LaserJet Pro',
    location: 'Ground Floor - Counter 1',
    status: 'online',
    queueCount: 2,
  },
  {
    id: '2',
    name: 'Canon PIXMA Color',
    location: 'Ground Floor - Counter 2',
    status: 'online',
    queueCount: 0,
  },
  {
    id: '3',
    name: 'Epson L3210',
    location: 'First Floor - Counter 3',
    status: 'busy',
    queueCount: 5,
  },
  {
    id: '4',
    name: 'Brother HL-L2321D',
    location: 'First Floor - Counter 4',
    status: 'offline',
    queueCount: 0,
  },
];

export function Dashboard({ onNewPrint, userName }: DashboardProps) {
  const totalSpent = mockPrintHistory.reduce((sum, job) => sum + job.cost, 0);
  const totalJobs = mockPrintHistory.length;
  const totalPages = mockPrintHistory.reduce((sum, job) => sum + (job.pages * job.copies), 0);

  return (
    <div className="min-h-screen bg-neutral-900 pb-8">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {userName}!
              </h1>
              <p className="text-neutral-400">Manage your print jobs and track your activity</p>
            </div>
            <Button
              onClick={onNewPrint}
              className="bg-red-500 hover:bg-red-600 text-white h-12 px-6 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              New Print Job
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">{totalJobs}</p>
            <p className="text-sm text-neutral-600">Total Print Jobs</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{totalPages}</p>
            <p className="text-sm text-neutral-600">Pages Printed</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900">₹{totalSpent}</p>
            <p className="text-sm text-neutral-600">Total Spent</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Printer className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {mockPrinters.filter(p => p.status === 'online').length}
            </p>
            <p className="text-sm text-neutral-600">Printers Online</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Print History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Recent Print Jobs</h2>
              <Clock className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="space-y-4">
              {mockPrintHistory.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-red-300 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-neutral-900 truncate">{job.fileName}</p>
                        <Badge
                          variant="default"
                          className="bg-green-500 text-white flex-shrink-0"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-1">
                        {job.pages} pages × {job.copies} {job.copies === 1 ? 'copy' : 'copies'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span>Job ID: {job.id}</span>
                        <span>•</span>
                        <span>{job.printerLocation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="font-bold text-neutral-900">₹{job.cost}</p>
                    <p className="text-xs text-neutral-500">{job.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-6 border-2"
            >
              View All History
            </Button>
          </motion.div>

          {/* Printer Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Printer Status</h2>
              <Printer className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="space-y-4">
              {mockPrinters.map((printer, index) => (
                <motion.div
                  key={printer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 border border-neutral-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate mb-1">{printer.name}</p>
                      <p className="text-xs text-neutral-500">{printer.location}</p>
                    </div>
                    <Badge
                      variant={printer.status === 'online' ? 'default' : 'secondary'}
                      className={`ml-2 flex-shrink-0 ${
                        printer.status === 'online'
                          ? 'bg-green-500'
                          : printer.status === 'busy'
                          ? 'bg-orange-500'
                          : 'bg-neutral-500'
                      }`}
                    >
                      {printer.status}
                    </Badge>
                  </div>
                  {printer.status !== 'offline' && printer.queueCount > 0 && (
                    <p className="text-xs text-neutral-600 mt-2">
                      {printer.queueCount} job{printer.queueCount !== 1 ? 's' : ''} in queue
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 font-medium mb-1">💡 Pro Tip</p>
              <p className="text-xs text-blue-700">
                Choose printers with no queue for fastest printing
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
