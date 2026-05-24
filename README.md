# VeriScan

VeriScan is a comprehensive security and academic verification platform designed to detect threats and verify the authenticity of digital content. It provides a powerful suite of tools including deepfake detection, phishing analysis, plagiarism checking, metadata forensics, and malicious URL scanning, backed by blockchain technology for secure logging.

## Features

- **Deepfake Scanner:** Analyzes media files to detect AI-generated or manipulated content.
- **Phishing Detector:** Scans texts and emails for social engineering and phishing attempts.
- **URL Scanner:** Evaluates links for malicious intent or security risks.
- **Plagiarism Detector:** Checks academic and professional documents for unoriginal content.
- **Metadata Forensics:** Extracts and analyzes hidden metadata from files for security verification.
- **Blockchain Logging:** Ensures immutable and transparent logging of verification results.

## Tech Stack

### Frontend
- **Framework:** React (via Vite)
- **Styling:** Tailwind CSS, Framer Motion (for animations)
- **Routing:** React Router DOM
- **Authentication/Database:** Firebase
- **Icons:** React Icons

### Backend
- **Framework:** FastAPI (Python)
- **Architecture:** Modular service-based architecture
- **Detectors:** Built-in AI, Media, Metadata, Phishing, Plagiarism, and URL detection services
- **Integration:** CORS enabled for seamless connection with the React frontend

## Getting Started

### Prerequisites
- Node.js
- Python (3.10+)

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   fastapi dev main.py
   # or
   # uvicorn main:app --reload
   ```
   The backend API will run on `http://localhost:8000`.
