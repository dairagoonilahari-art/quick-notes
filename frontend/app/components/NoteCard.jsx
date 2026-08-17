"use client";

import { useState } from "react";

export default function NoteCard({
  note,
  onDelete,
  onEdit,
  onPin,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");

  const handleEdit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter both a title and content.");
      return;
    }

    try {
      const response = await fetch(
     `${process.env.NEXT_PUBLIC_API_URL}/api/notes/${note.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            category: note.category || "Personal",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();

      onEdit(updatedNote);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update note.");
    }
  };

  return (
    <div className="note-card">

      {/* ================= EDIT MODE ================= */}
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
          />

          <div className="note-actions">
            <button
              onClick={handleEdit}
              className="icon-btn"
              title="Save"
            >
              💾
            </button>

            <button
              onClick={() => {
                setTitle(note.title || "");
                setContent(note.content || "");
                setIsEditing(false);
              }}
              className="icon-btn"
              title="Cancel"
            >
              ❌
            </button>
          </div>
        </>
      ) : (
        <>
          {/* ================= TITLE ================= */}
          <h3>{note.title}</h3>

          {/* ================= CATEGORY ================= */}
          <span
            className={`note-category ${
              note.category?.toLowerCase() || "personal"
            }`}
          >
            {note.category === "Study" && "📚"}
            {note.category === "Work" && "💼"}
            {note.category === "Ideas" && "💡"}
            {(!note.category || note.category === "Personal") && "👤"}

            {" "}
            {note.category || "Personal"}
          </span>

          {/* ================= CONTENT ================= */}
          <p>{note.content}</p>

          {/* ================= PDF ================= */}
          {note.file && (
            <div className="note-file">

              <div className="file-info">

                <div className="pdf-icon">
                  📄
                </div>

                <div className="file-details">
                  <span className="file-name">
                    {note.file.name}
                  </span>

                  <small>
                    PDF Document
                  </small>
                </div>

              </div>

              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}${note.file.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="open-pdf"
              >
                View PDF ↗
              </a>

            </div>
          )}

          {/* ================= DATE ================= */}
          {note.createdAt && (
            <div className="note-date">
              🕐{" "}
              {new Date(note.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </div>
          )}

          {/* ================= ACTIONS ================= */}
          <div className="note-actions">

            <button
              onClick={() => onPin(note.id)}
              className="icon-btn"
              title={
                note.pinned
                  ? "Unpin note"
                  : "Pin note"
              }
            >
              {note.pinned ? "📌" : "📍"}
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="icon-btn edit-btn"
              title="Edit note"
            >
              ✏️
            </button>

            <button
              onClick={() => onDelete(note.id)}
              className="icon-btn delete-btn"
              title="Delete note"
            >
              🗑️
            </button>

          </div>
        </>
      )}

    </div>
  );
}