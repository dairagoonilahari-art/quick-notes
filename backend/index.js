const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 5000;

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// PDF Upload Configuration
// ===============================
const uploadsPath = path.join(__dirname, "uploads");

// Make sure uploads folder exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  }
});

// Make uploaded PDFs accessible
app.use("/uploads", express.static(uploadsPath));

// ===============================
// Notes JSON File
// ===============================
const notesFile = path.join(__dirname, "notes.json");

// Read notes
const getNotes = () => {
  const data = fs.readFileSync(notesFile, "utf-8");
  return JSON.parse(data);
};

// Save notes
const saveNotes = (notes) => {
  fs.writeFileSync(
    notesFile,
    JSON.stringify(notes, null, 2)
  );
};

// ===============================
// GET - Get all notes
// ===============================
app.get("/api/notes", (req, res) => {
  try {
    const notes = getNotes();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load notes"
    });
  }
});

// ===============================
// POST - Create a new note
// ===============================
app.post(
  "/api/notes",
  upload.single("file"),
  (req, res) => {
    try {
      const { title, content, category } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required"
        });
      }

      const notes = getNotes();

      const newNote = {
        id:
          notes.length > 0
            ? Math.max(...notes.map(note => note.id)) + 1
            : 1,

        title,
        content,
        category: category || "Personal",

        pinned: false,

        createdAt: new Date().toISOString()
      };

      // ===============================
      // PDF information
      // ===============================
      if (req.file) {
        newNote.file = {
          name: req.file.originalname,
          url: `/uploads/${req.file.filename}`
        };
      }

      notes.push(newNote);

      saveNotes(notes);

      res.status(201).json(newNote);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create note"
      });
    }
  }
);

// ===============================
// PUT - Update a note
// ===============================
app.put("/api/notes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const {
      title,
      content,
      category
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const notes = getNotes();

    const noteIndex = notes.findIndex(
      note => note.id === id
    );

    if (noteIndex === -1) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    notes[noteIndex].title = title;
    notes[noteIndex].content = content;
    notes[noteIndex].category =
      category || "Personal";

    saveNotes(notes);

    res.json(notes[noteIndex]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update note"
    });
  }
});

// ===============================
// DELETE - Delete a note
// ===============================
app.delete("/api/notes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const notes = getNotes();

    const noteExists = notes.some(
      note => note.id === id
    );

    if (!noteExists) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    const updatedNotes = notes.filter(
      note => note.id !== id
    );

    saveNotes(updatedNotes);

    res.json({
      message: "Note deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete note"
    });
  }
});

// ===============================
// PUT - Toggle Pin
// ===============================
app.put("/api/notes/:id/pin", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const notes = getNotes();

    const note = notes.find(
      note => note.id === id
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    note.pinned = !note.pinned;

    saveNotes(notes);

    res.json(note);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update pin status"
    });
  }
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});