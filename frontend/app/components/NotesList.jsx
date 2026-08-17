"use client";

import { useState } from "react";
import NoteCard from "./NoteCard";

export default function NotesList({ notes, onDelete, onEdit, onPin }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNotes =
    selectedCategory === "All"
      ? notes
      : notes.filter(
          (note) =>
            (note.category || "Personal") === selectedCategory
        );

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const normalNotes = filteredNotes.filter((note) => !note.pinned);

  return (
    <section>
      {/* CATEGORY FILTER */}
      <div className="category-filter">
        <button
          className={selectedCategory === "All" ? "active" : ""}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>

        <button
          className={selectedCategory === "Study" ? "active" : ""}
          onClick={() => setSelectedCategory("Study")}
        >
          📚 Study
        </button>

        <button
          className={selectedCategory === "Work" ? "active" : ""}
          onClick={() => setSelectedCategory("Work")}
        >
          💼 Work
        </button>

        <button
          className={selectedCategory === "Ideas" ? "active" : ""}
          onClick={() => setSelectedCategory("Ideas")}
        >
          💡 Ideas
        </button>

        <button
          className={selectedCategory === "Personal" ? "active" : ""}
          onClick={() => setSelectedCategory("Personal")}
        >
          👤 Personal
        </button>
      </div>

      {/* PINNED NOTES */}
      {pinnedNotes.length > 0 && (
        <>
          <div className="notes-header">
            <h2>📌 Pinned Notes</h2>

            <span>
              {pinnedNotes.length}{" "}
              {pinnedNotes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          <div className="notes-grid">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={onDelete}
                onEdit={onEdit}
                onPin={onPin}
              />
            ))}
          </div>
        </>
      )}

      {/* NORMAL NOTES */}
      <div className="notes-header">
        <h2>Your Notes</h2>

        <span>
          {normalNotes.length}{" "}
          {normalNotes.length === 1 ? "note" : "notes"}
        </span>
      </div>

      {/* NO NOTES */}
      {normalNotes.length === 0 && pinnedNotes.length === 0 ? (
        <div className="empty-state">
          <h3>No notes yet 📝</h3>
          <p>Create your first note using the form above.</p>
        </div>
      ) : normalNotes.length === 0 ? (
        <div className="empty-state">
          <h3>All notes are pinned 📌</h3>
          <p>Unpin a note to move it back here.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {normalNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={onDelete}
              onEdit={onEdit}
              onPin={onPin}
            />
          ))}
        </div>
      )}
    </section>
  );
}