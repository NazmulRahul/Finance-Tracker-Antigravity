# Finance Dashboard - Finance Tracker Built using Antigravity 

A full-stack finance dashboard application built with the MERN stack (MongoDB, Express, React, Node.js).

## Prerequisite
- Docker
- Docker Compose

## Getting Started

### 1. Configuration
The application requires environment variables for the backend.
- Copy `backend/.env.example` to `backend/.env`.
- Fill in your `MONGO_URI` (from MongoDB Atlas) and other secrets.

```bash
cp backend/.env.example backend/.env
```

### 2. Run with Docker
In the root directory, run:

```bash
docker compose up --build
```

### 3. Access the Application
- **Frontend**: http://localhost (Port 80)
- **Backend API**: http://localhost:5000/api

