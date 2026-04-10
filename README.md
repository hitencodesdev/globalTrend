# Full Stack Task Manager

A simple full-stack task manager application built with React, Express, and MongoDB.

## Features

- View all tasks
- Add a new task
- Mark tasks as completed
- Delete tasks
- Clean, minimal, and responsive user interface

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express.js, Mongoose, CORS
- **Database**: MongoDB

## Prerequisites

- Node.js (v16.0 or higher recommended)
- MongoDB running locally on `mongodb://localhost:27017`

## Setup Instructions

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/hitencodesdev/globalTrend.git
   cd globalTrend
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

You will need two separate terminal windows/tabs to run the backend and frontend simultaneously.

**Terminal 1 (Backend)**:
```bash
cd backend
node server.js
```
*The backend will run on `http://localhost:5000`.*

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## Assumptions & Trade-offs
- Used Tailwind CSS to achieve a clean minimal UI without adding large component library dependencies.
- Added simple loading states and error handling basic alerts via state.
- Used in-memory optimistic updates for toggling completion and deleting tasks to ensure a snappy user experience.
- The MongoDB instance URI is defaulted to the local standard port without authentication.

