import React, { useState, useRef } from "react";
import { FiUploadCloud, FiFile, FiCheckCircle } from "react-icons/fi";

function UploadResume({ setFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Handle Drag Events
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
      e.dataTransfer.clearData();
    }
  };

  // Handle Click Event (opens file browser)
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file format! 📄");
      return;
    }

    const size = (selectedFile.size / 1024).toFixed(1);

    setFileName(`${selectedFile.name} (${size} KB)`);
    setFile(selectedFile);
  };

  // Trigger hidden input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          fontSize: "0.95rem",
          color: "var(--text)",
        }}
      >
        Upload Resume
      </label>

      <div
        className={`upload-dropzone ${isDragging ? "dragging" : ""} ${fileName ? "has-file" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }} // Hide the native input!
        />

        {fileName ? (
          <div className="file-selected-view">
            <FiCheckCircle
              size={32}
              color="var(--accent)"
              style={{ marginBottom: "10px" }}
            />
            <p className="primary-text">File Uploaded Successfully</p>
            <p
              className="secondary-text"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <FiFile size={14} /> {fileName}
            </p>
            <p className="click-to-change">(Click or drag to change file)</p>
          </div>
        ) : (
          <div className="empty-upload-view">
            <FiUploadCloud size={38} className="upload-icon" />
            <p className="primary-text">
              <span className="text-gradient">Click to upload</span> or drag and
              drop
            </p>
            <p className="secondary-text">PDF (Max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadResume;
