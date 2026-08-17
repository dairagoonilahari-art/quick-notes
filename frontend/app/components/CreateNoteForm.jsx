"use client";

import { useRef, useState } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/notes`;

export default function CreateNoteForm({ onNoteCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Personal");
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const newNote = await response.json();

      setTitle("");
      setContent("");
      setCategory("Personal");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onNoteCreated(newNote);
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Could not create note.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-note-form">

      {/* Title */}
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="note-title-input"
      />

      {/* Content */}
      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="note-content-input"
      />

      <div className="form-bottom">

        {/* Category */}
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Personal">👤 Personal</option>
          <option value="Study">📚 Study</option>
          <option value="Work">💼 Work</option>
          <option value="Ideas">💡 Ideas</option>
        </select>

        {/* PDF Attachment */}
        <div className="pdf-upload-area">

          <input
            ref={fileInputRef}
            id="pdf-file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            hidden
          />

          {!file ? (
            <label
              htmlFor="pdf-file"
              className="attach-pdf-btn"
            >
              <span className="attach-icon">📎</span>
              <span>Attach PDF</span>
            </label>
          ) : (
            <div className="selected-pdf">

              <div className="pdf-file-info">
                <div className="pdf-file-icon">
                  📄
                </div>

                <div className="pdf-file-text">
                  <strong>{file.name}</strong>
                  <small>PDF Document</small>
                </div>
              </div>

              <button
                type="button"
                className="remove-file-btn"
                onClick={removeFile}
                title="Remove PDF"
              >
                ×
              </button>

            </div>
          )}

        </div>

        {/* Add Note */}
        <button
          type="submit"
          className="add-note-btn"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Note"}
        </button>

      </div>

    </form>
  );
}