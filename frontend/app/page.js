"use client";

import { useEffect, useState } from "react";
import CreateNoteForm from "./components/CreateNoteForm";
import NotesList from "./components/NotesList";
import Toast from "./components/Toast";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/notes`;

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");

    if (savedTheme === "true") {
      setDarkMode(true);
    }
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Toast
  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setError("");
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Unable to connect to the notes server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Search + Sort
  const filteredNotes = notes
    .filter((note) => {
      const search = searchTerm.toLowerCase();

      return (
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
        );
      }

      if (sortBy === "az") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "za") {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });

  // Add note
  const handleNoteCreated = (newNote) => {
    setNotes((currentNotes) => [
      ...currentNotes,
      newNote,
    ]);

    showToast("📝 Note created");
  };

  // Edit note
  const handleEdit = (updatedNote) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === updatedNote.id
          ? updatedNote
          : note
      )
    );

    showToast("✏️ Note updated");
  };

  // Pin / Unpin note
  const handlePin = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}/pin`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to pin note");
      }

      const updatedNote = await response.json();

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === updatedNote.id
            ? updatedNote
            : note
        )
      );

      showToast(
        updatedNote.pinned
          ? "📌 Note pinned"
          : "📍 Note unpinned"
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to pin note.", "error");
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((currentNotes) =>
        currentNotes.filter(
          (note) => note.id !== id
        )
      );

      showToast("🗑️ Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      showToast(
        "Could not delete note.",
        "error"
      );
    }
  };

  return (
    <main className={darkMode ? "dark-mode" : ""}>

      <Toast
        message={toast}
        type={toastType}
      />

      {/* HERO */}
      <div className="hero">

        <div className="hero-icon">
          📝
        </div>

        <div className="hero-content">
          <h1>Quick Notes</h1>
          <p>
            Capture your ideas and organize your thoughts
          </p>
        </div>

        <button
          className="theme-toggle"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

      </div>

      {/* CREATE NOTE */}
      <CreateNoteForm
        onNoteCreated={handleNoteCreated}
      />

      {/* SEARCH */}
      <div className="search-box">

        <span>🔍</span>

        <input
          type="text"
          placeholder="Search your notes..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>

      {/* SORT */}
      <div className="sort-box">

        <label htmlFor="sort">
          Sort:
        </label>

        <select
          id="sort"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="newest">
            🆕 Newest First
          </option>

          <option value="oldest">
            🕐 Oldest First
          </option>

          <option value="az">
            🔤 A → Z
          </option>

          <option value="za">
            🔤 Z → A
          </option>
        </select>

      </div>

      {/* NOTES */}
      {loading ? (
        <p className="status-message">
          Loading notes... ⏳
        </p>
      ) : error ? (
        <div className="error-message">

          <p>{error}</p>

          <button onClick={fetchNotes}>
            Try Again
          </button>

        </div>
      ) : (
        <NotesList
          notes={filteredNotes}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onPin={handlePin}
        />
      )}

      {/* FOOTER */}
      <footer className="footer">
        <p>
          Quick Notes • © 2026
        </p>
      </footer>

    </main>
  );
}