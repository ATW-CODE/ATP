import { Printer, FileText, Clock, IndianRupee, TrendingUp, CheckCircle2, LayoutGrid, Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { motion } from 'motion/react';
import { useEffect, useState } from "react";

interface DashboardProps {
  onNewPrint: () => void;
  onLogout: () => void;
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

export function Dashboard({ onNewPrint, onLogout, userName }: DashboardProps) {

  const [printHistory, setPrintHistory] = useState<PrintJob[]>([]);
  const [printers, setPrinters] = useState<PrinterStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("atp_token");
      const userName = localStorage.getItem("atp_user_name") || "User";

      /* Fetch jobs */
      const jobsRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/print/jobs/mine`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jobsData = await jobsRes.json();

      if (!jobsRes.ok) throw new Error(jobsData.message);

      /* Fetch printers */
      const printerRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/printers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const printerData = await printerRes.json();

      if (!printerRes.ok) throw new Error(printerData.message);

      /* Map jobs */
      const mappedJobs: PrintJob[] = jobsData.map((j: any) => ({
        id: j.id,
        fileName: j.original_filename,
        pages: j.pages,
        copies: j.copies,
        cost: Number(j.cost),
        status:
          j.status === "completed"
            ? "completed"
            : j.status === "printing" || j.status === "processing"
            ? "processing"
            : "failed", 
        timestamp: new Date(j.created_at).toLocaleString(),
        printerLocation: j.printer_name,
      }));

      /* Map printers */
      const mappedPrinters: PrinterStatus[] = printerData.map((p: any) => ({
        id: p.id,
        name: p.name,
        location: p.location_name,
        status: p.status,
        queueCount: 0, // optional (add later from backend)
      }));

      setPrintHistory(mappedJobs);
      setPrinters(mappedPrinters);

    } catch (err) {
      console.error("Dashboard load failed", err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = printHistory.reduce((sum, job) => sum + job.cost, 0); 
  const totalJobs = printHistory.length; 
  const totalPages = printHistory.reduce((sum, job) => sum + (job.pages * job.copies), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

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
            <Button
              onClick={onLogout}
              className="
                border border-neutral-600 text-neutral-700 bg-white hover:bg-red-50 hover:text-red-600 hover:bg-neutral-700 active:scale-95 transition-all duration-150"
            >
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
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
              {printers.filter(p => p.status === 'online').length}
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
              {printHistory.slice(0,5).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  // className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-red-300 transition-colors"
                  className='flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-neutral-200 rounded-lg hover:border-red-300 transition-colors gap-3'
                >
                  <div className="flex items-start gap-3 flex-1">
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
                        <span className='truncate max-w-[140px]'>Job ID: {job.id}</span>
                        <span>•</span>
                        <span>{job.printerLocation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:block justify-between md:text-right text-sm md:ml-4">
                  {/* <div className="text-right ml-4 flex-shrink-0"> */}
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
              {printers.map((printer, index) => (
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
