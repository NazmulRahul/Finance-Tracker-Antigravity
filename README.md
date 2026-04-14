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

## Deployment

This application is ready for deployment. We recommend using **Render** for the backend and **Vercel** for the frontend for the best free-tier experience.

### 1. Backend Deployment (Render)
- Push your code to a GitHub repository.
- Log in to your [Render](https://render.com/) account.
- Click **New** > **Blueprint**.
- Connect your GitHub repository.
- Render will automatically detect the `render.yaml` file.
- Follow the prompts to set the required environment variables:
    - `MONGO_URI`: Your MongoDB Atlas connection string.
    - `EMAIL_USER`: Your Gmail address.
    - `EMAIL_PASS`: Your Gmail App Password.
    - `FRONTEND_URL`: The URL of your Vercel deployment (you can update this after deploying the frontend).

### 2. Frontend Deployment (Vercel)
- Log in to your [Vercel](https://vercel.com/) account.
- Click **New Project** and import your GitHub repository.
- Select the `frontend` folder as the root directory.
- **Framework Preset**: Vite.
- **Environment Variables**:
    - `VITE_API_URL`: The URL of your Render backend API (e.g., `https://finance-tracker-api.onrender.com/api`).
- Click **Deploy**.

## Local Development (Docker)
To run the app locally using Docker, refer to the [Getting Started](#getting-started) section.
