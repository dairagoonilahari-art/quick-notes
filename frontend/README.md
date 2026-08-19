# 📝 Quick Notes

A full-stack notes management application built with **Next.js**, **React**, **Node.js**, and **Express.js**.

## 🌐 Live Demo

**Frontend:** https://quick-notes-frontend-k51n.onrender.com

**Backend API:** https://quick-notes-lf2q.onrender.com

## ✨ Features

- 📝 Create notes
- ✏️ Edit notes
- 🗑️ Delete notes
- 📌 Pin and unpin notes
- 🔍 Search notes
- 🔤 Sort notes
- 🌙 Dark mode
- 📱 Responsive user interface
- 🔗 REST API integration

## 🛠️ Tech Stack

### Frontend

- Next.js 13
- React
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- REST API

### Deployment

- GitHub
- Render

## 📁 Project Structure

```text
quick-notes/
├── backend/
│   ├── index.js
│   ├── notes.json
│   └── package.json
│
└── frontend/
    ├── app/
    ├── public/
    ├── package.json
    └── next.config.js
```
## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dairagoonilahari-art/quick-notes.git
cd quick-notes
```
### 2. Run the backend
```bash
cd backend
npm install
node index.js
```
The backend will run on:
```
http://localhost:5000
```
### 3. Run the frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on:

```
http://localhost:3000
```
## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| PUT | `/api/notes/:id/pin` | Pin or unpin a note |
| DELETE | `/api/notes/:id` | Delete a note |

## 🚀 Deployment

The application is deployed using **Render**.

- **Frontend:** Next.js
- **Backend:** Node.js + Express
- **Repository:** GitHub

## 👩‍💻 Author

**Dairagooni Lahari**

Built as a full-stack web development project.
