import { useState, useEffect, use} from 'react';
import { LoginScreen } from '@/app/components/LoginScreen';
import { Dashboard } from '@/app/components/Dashboard';
import { DocumentUploadScreen } from '@/app/components/DocumentUploadScreen';
import { DocumentPreview } from '@/app/components/DocumentPreview';
import { PrintConfiguration } from '@/app/components/PrintConfiguration';
import { StickyBottomBar } from '@/app/components/StickyBottomBar';
import { PaymentModal } from '@/app/components/PaymentModal';
import { ProcessingScreen } from '@/app/components/ProcessingScreen';
import { SuccessScreen } from '@/app/components/SuccessScreen';
import { X, ArrowLeft } from 'lucide-react';
import { c, F } from 'node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf';
import { set } from 'date-fns';

type AppStage = 'dashboard' | 'upload' | 'configure' | 'payment' | 'processing' | 'success';

interface Printer {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'busy' | 'offline';
  supportsColor: boolean;
}

interface DocumentInfo {
  file: File;
  fileId: string;
  fileName: string;
  totalPages: number;
}


// // Mock printer data
// const mockPrinters: Printer[] = [
//   {
//     id: '1',
//     name: 'HP LaserJet Pro',
//     location: 'Ground Floor - Counter 1',
//     status: 'online',
//     supportsColor: false,
//   },
//   {
//     id: '2',
//     name: 'Canon PIXMA Color',
//     location: 'Ground Floor - Counter 2',
//     status: 'online',
//     supportsColor: true,
//   },
//   {
//     id: '3',
//     name: 'Epson L3210',
//     location: 'First Floor - Counter 3',
//     status: 'busy',
//     supportsColor: true,
//   },
//   {
//     id: '4',
//     name: 'Brother HL-L2321D',
//     location: 'First Floor - Counter 4',
//     status: 'offline',
//     supportsColor: false,
//   },
// ];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stage, setStage] = useState<AppStage>('upload');
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [copies, setCopies] = useState(1);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageRange, setPageRange] = useState('all');
  const [colorMode, setColorMode] = useState<'bw' | 'color'>('bw');
  const [paperSize, setPaperSize] = useState('A4');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [jobId, setJobId] = useState('');
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loadingPrinters, setLoadingPrinters] = useState(true);
  const [quote, setQuote] = useState<number | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("atp_token");

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/files`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("atp_token")}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    const uploaded = data.file;
    console.log("Upload response:", uploaded.id, uploaded.original_filename, uploaded.total_pages);

    setDocument({
      file,
      fileId: uploaded.id,
      fileName: uploaded.original_filename,
      totalPages: uploaded.total_pages,
    });

    setStage("configure");
  };

  const fetchPrinters = async () => {
    try {
      setLoadingPrinters(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/printers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("atp_token")}`,
          },
        }
      );

      const text = await res.text();

      if (res.status === 401) {
        console.warn("Token expired");

        localStorage.removeItem("atp_token");
        setIsAuthenticated(false);
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from backend");
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to load printers");
      }

      const mapped: Printer[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        location: p.location_name,
        status: p.status,
        supportsColor: true,
      }));

      setPrinters(mapped);

    } catch (err) {
      console.error("Printer fetch error:", err);
      setPrinters([]);
    } finally {
      setLoadingPrinters(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchPrinters();

    // Refresh every 10s
    const interval = setInterval(fetchPrinters, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const parsePageRange = (range: string, totalPages: number): number => {
    if (!range || range === "all") {
      return totalPages;
    }

    const pages = new Set<number>();

    const parts = range.split(",");

    for (const part of parts) {
      const trimmed = part.trim();

      // Handle ranges like 1-3
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");

        const start = Number(startStr);
        const end = Number(endStr);

        if (isNaN(start) || isNaN(end)) continue;

        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) {
            pages.add(i);
          }
        }
      }

      // Handle single numbers like 6
      else {
        const num = Number(trimmed);

        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          pages.add(num);
        }
      }
    }

    return pages.size;
  };  

  const getSelectedPagesCount = () => {
    if (!document) return 0;
      
      return parsePageRange(pageRange, document.totalPages);
    };

  // const calculateCost = () => {
  //   if (!document) {
  //     console.warn("totalPages not available");
  //     return 0;
  //   }

  //   const baseCostPerPage = colorMode === 'color' ? 3 : 1.5;
    
  //   console.log("pageRange: ", pageRange);
  //   console.log("totalPages: ", document.totalPages);

  //   const selectedPages = parsePageRange(pageRange, document.totalPages);
    
  //   console.log("Selected Pages: ", selectedPages);
  //   console.log("Copies: ", copies);
  //   console.log("Base CostPerPage: ", baseCostPerPage);

  //   const cost = Math.round(selectedPages * copies * baseCostPerPage);
  //   console.log("Cost", cost);
    
  //   return cost;
  // };

  const fetchQuote = async () => {
    if (!document || !selectedPrinter) return;

    try {
      setLoadingQuote(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/print/quote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("atp_token")}`,
          },
          body: JSON.stringify({
            fileId: document.fileId,
            copies,
            colorMode,     // backend will convert later
            pageRange,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Quote failed");
      }

      setQuote(data.total); // from backend
    } catch (err) {
      console.error("Quote error:", err);
      setQuote(null);
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [document, copies, colorMode, pageRange, selectedPrinter]);

  const handlePayClick = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/print/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("atp_token")}`,
          },
          body: JSON.stringify({
            fileId: document?.fileId,
            printerId: selectedPrinter,
            totalPages: getSelectedPagesCount(),
            copies,
            colorMode: colorMode === "color",
          }),
        }
      );

      const data = await res.json();

      console.log("Print job response:", data);

      if (!res.ok) {
        throw new Error(data.message);
      }

      console.log("Print job created:", data);

      setShowPaymentModal(true);

    } catch (err) {
      console.error("Job creation failed:", err);
      alert("Failed to create print job");
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setStage('processing');
  };

  const handleProcessingComplete = () => {
    // Generate job ID
    setJobId(`ATP${Date.now().toString().slice(-6)}`);
    setStage('success');
  };

  const handleNewPrint = () => {
    // Reset all state
    setDocument(null);
    setSelectedPrinter(null);
    setCopies(1);
    setOrientation('portrait');
    setPageRange('all');
    setColorMode('bw');
    setPaperSize('A4');
    setJobId('');
    setStage('upload');
  };

  const handleCancel = () => {
    // Same as handleNewPrint - go back to upload
    handleNewPrint();
  };

  const isPrintReady = selectedPrinter !== null && document !== null;
  const totalCost = quote ?? 0;
  const selectedPrinterData = printers.find(p => p.id === selectedPrinter);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleGoToDashboard = () => {
    setStage('dashboard');
  };

  const handleGoToUpload = () => {
    setStage('upload');
  };

  // Show login screen first
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Dashboard Stage
  if (stage === 'dashboard') {
    return <Dashboard onNewPrint={handleGoToUpload} userName="User" />;
  }

  // Upload Stage
  if (stage === 'upload') {
    return <DocumentUploadScreen onFileUploaded={handleFileSelect} onDashboardClick={handleGoToDashboard} />;
  }

  // Processing Stage
  if (stage === 'processing') {
    return <ProcessingScreen onComplete={handleProcessingComplete} />;
  }

  // Success Stage
  if (stage === 'success') {
    return (
      <SuccessScreen
        jobId={jobId}
        printerLocation={selectedPrinterData?.location || 'Unknown'}
        pages={document?.totalPages || 0}
        copies={copies}
        totalCost={totalCost}
        onNewPrint={handleNewPrint}
      />
    );
  }

  // Configure Stage (Main UI)
  return (
    <>
      <div className="min-h-screen bg-neutral-900 pb-32">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 md:p-6 md:max-w-7xl md:mx-auto md:min-h-screen md:pb-0">
          {/* Left: Preview (Fixed) */}
          <div className="sticky top-6 h-fit">
            {document && (
              <DocumentPreview file={document.file} />
            )}
          </div>

          {/* Right: Configuration */}
          <div className="pb-6">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Configure Print</h1>
                <p className="text-neutral-400">Set your printing preferences</p>
              </div>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
            <PrintConfiguration
              printers={printers}
              selectedPrinter={selectedPrinter}
              onSelectPrinter={setSelectedPrinter}
              copies={copies}
              onCopiesChange={setCopies}
              orientation={orientation}
              onOrientationChange={setOrientation}
              pageRange={pageRange}
              onPageRangeChange={setPageRange}
              colorMode={colorMode}
              onColorModeChange={setColorMode}
              paperSize={paperSize}
              onPaperSizeChange={setPaperSize}
            />
            {/* Desktop Pay Button */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <span>{getSelectedPagesCount()} pages</span>
                  <span>•</span>
                  <span>{copies} {copies === 1 ? 'copy' : 'copies'}</span>
                </div>
                <div className="flex items-center gap-1 text-2xl font-bold text-neutral-900">
                  {loadingQuote ? "..." : `₹${totalCost}`}
                </div>
              </div>
              <button
                onClick={handlePayClick}
                disabled={!isPrintReady || loadingQuote || quote === null}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white h-14 text-lg font-semibold rounded-xl shadow-lg transition-colors"
              >
                Pay & Print
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Header */}
          <div className="p-4 pb-3 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Configure Print</h1>
              <p className="text-sm text-neutral-400">Set your preferences below</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Fixed Preview Section (40-45% screen height) */}
          <div className="px-4" style={{ height: '42vh' }}>
            {document && (
              <div className="h-full">
                <DocumentPreview file={document.file} />
              </div>
            )}
          </div>

          {/* Scrollable Configuration Section */}
          <div className="px-4 py-4 overflow-y-auto" style={{ maxHeight: '50vh' }}>
            <PrintConfiguration
              printers={printers}
              selectedPrinter={selectedPrinter}
              onSelectPrinter={setSelectedPrinter}
              copies={copies}
              onCopiesChange={setCopies}
              orientation={orientation}
              onOrientationChange={setOrientation}
              pageRange={pageRange}
              onPageRangeChange={setPageRange}
              colorMode={colorMode}
              onColorModeChange={setColorMode}
              paperSize={paperSize}
              onPaperSizeChange={setPaperSize}
            />
          </div>
        </div>

        {/* Sticky Bottom Bar (Mobile & Tablet) */}
        <div className="md:hidden">
          <StickyBottomBar
            totalCost={totalCost}
            pages={getSelectedPagesCount()}
            copies={copies}
            disabled={!isPrintReady}
            onPayClick={handlePayClick}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalCost={totalCost}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}