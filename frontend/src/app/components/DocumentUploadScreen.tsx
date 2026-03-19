import { Upload, LayoutGrid } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
// import { on } from "events";

interface UploadedFile {
  id: string;
  original_filename: string;
  pages: number;
}

export interface UploadedDocument {
  file: File;
  fileId: string;
  totalPages: number;
}

interface DocumentUploadScreenProps {
  onFileUploaded: (file: File) => void;
  onDashboardClick: () => void;
}

export function DocumentUploadScreen({
  onFileUploaded,
  onDashboardClick,
}: DocumentUploadScreenProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      // const res = await fetch(
      //   `${import.meta.env.VITE_API_BASE_URL}/files`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("atp_token")}`,
      //     },
      //     body: formData,
      //   }
      // );

      // const data = await res.json();

      // if (!res.ok) {
      //   throw new Error(data.message || "Upload failed");
      // }

      onFileUploaded(file);

      // Pass uploaded file metadata upward
      // onFileUploaded({
      //   file,
      //   fileId: data.file.id,
      //   totalPages: 8,
      // });

    } catch (err) {
      console.error("Upload error:", err);
      alert("File upload failed");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-neutral-900">
      <div className="w-full max-w-md">
        {/* Dashboard Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={onDashboardClick}
            variant="outline"
            className="bg-neutral-800 text-white border border-neutral-600 hover:bg-neutral-700 flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            ATP Print Kiosk
          </h1>
          <p className="text-neutral-400">
            Upload your document to get started
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-colors
              ${
                uploading
                  ? "border-neutral-300 opacity-50 cursor-not-allowed"
                  : "border-neutral-300 hover:border-red-500 cursor-pointer"
              }
            `}
          >
            <Upload className="w-16 h-16 text-neutral-400 mb-4" />
            <span className="text-lg font-medium text-neutral-700 mb-2">
              {uploading ? "Uploading document…" : "Tap to upload document"}
            </span>
            <span className="text-sm text-neutral-500">
              PDF, DOC, DOCX up to 10MB
            </span>

            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Your documents are processed securely and deleted after printing
          </p>
        </div>
      </div>
    </div>
  );
}
