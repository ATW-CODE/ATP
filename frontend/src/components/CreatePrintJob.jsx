import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function CreatePrintJob({ files, onJobCreated }) {
  const [fileId, setFileId] = useState("");
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [printerId, setPrinterId] = useState("");

  // Load printers
  useEffect(() => {
    apiFetch("printers")
      .then(setPrinters)
      .catch(err => console.error(err));
  }, []);


  const submitJob = async (e) => {
    e.preventDefault();

    if (!fileId) {
      alert("Please select a file");
      return;
    }

    if (!printerId) {
      alert("Please select a printer location");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("print/jobs", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          printerId,
          copies,
          color,
        }),
      });

      // Reset form
      setFileId("");
      setCopies(1);
      setColor(false);

      onJobCreated(); 
    } catch (err) {
      console.error("Create print job error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Create Print Job</h3>

      <form onSubmit={submitJob}>
        <div>
          <label>Printer:</label>
          <select
            value={printerId}
            onChange={(e) => setPrinterId(e.target.value)}
            required
          >
            <option value="">Select printer location</option>
            {printers.map(p => (
              <option
                key={p.id}
                value={p.id}
                disabled={p.status !== "online"}
              >
                {p.location_name} ({p.status})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>File:</label>
          <select value={fileId} onChange={(e) => setFileId(e.target.value)}
            required
            >
            <option value="">Select file</option>
            {Array.isArray(files) && files.map((file) => (
              <option key={file.id} value={file.id}>
                {file.original_filename}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Copies:</label>
          <input
            type="number"
            min="1"
            value={copies}
            onChange={(e) => setCopies(Number(e.target.value))}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={color}
              onChange={(e) => setColor(e.target.checked)}
            />
            Color Print
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}