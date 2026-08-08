# 🎓 CA Exam Prep AI Chatbot

An AI-powered mentor and tutor designed to help CA students prepare for their Chartered Accountancy exams (Foundation, Intermediate, Final). 

It features **universal document text extraction** (handwritten notes, scanned books, images, Word documents, text files, and PDFs) powered by **EasyOCR**, **PyMuPDF**, and **LangChain + ChromaDB** RAG vector search.

---

## 📁 Project Architecture

The application is cleanly organized into three core modules:

```
AI CHATBOT FOR CA/
│
├── 🐍 backend/         # FastAPI Backend Server & Document Extraction Engine
│   ├── main.py        # API routes, RAG chain, EasyOCR reader
│   ├── requirements.txt # Python dependencies
│   ├── .env           # Secret API Keys (Groq, Supabase)
│   ├── venv/          # Python Virtual Environment
│   └── uploads/       # Storage directory for uploaded study materials
│
├── ⚛️ frontend/        # React + Vite Frontend Application
│   ├── src/           # React components (App.jsx, ChatArea, Sidebar, etc.)
│   ├── public/        # Static assets and logo
│   ├── package.json   # Node.js dependencies & scripts
│   └── node_modules/  # Installed JavaScript packages
│
└── 🗄️ database/        # Vector Database Storage
    └── chroma_db/     # Persistent ChromaDB vector store embeddings
```

---

## ✨ Features

- **📄 Universal Document Ingestion**: Upload any study material — handwritten notes, scanned book pages, screenshots, `.png`/`.jpg` images, `.pdf`, `.docx`, or `.txt`.
- **🔍 OCR & Deep Learning Extraction**: Extracts text from images and scanned notes automatically using EasyOCR.
- **📚 Smart Model Training (RAG)**: Automatically splits and embeds document text into ChromaDB so the AI tutor can answer questions based directly on your study materials.
- **💬 Conversational CA Mentor**: Friendly, encouraging AI tutor powered by Llama 3.1 via Groq API.

---

## 🚀 How to Run

### 1. Start the Backend Server
```bash
cd backend
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```
*Backend API will run at `http://localhost:8000`.*

### 2. Start the Frontend Application
Open a new terminal window:
```bash
cd frontend
npm run dev
```
*Frontend Web Application will run at `http://localhost:5173`.*
