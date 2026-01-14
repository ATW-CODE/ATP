import React, { useState } from "react";

export default function UploadFile({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("atp_token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUpload?.(data); // notify dashboard
      setFile(null);
      alert("File uploaded");
    } catch (err) {
      alert("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Upload File</h3>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
