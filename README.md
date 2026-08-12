# Synergie Global - Take Home Test (Bright Path Learning Centre)
#### Time when requirements .pdf file was first opened: 19:15:50 PM 12/08/26
#### Time when assignment is finished: 21:45:44 PM 12/08/26

---

## Project Features
- **Today's Lessons View**: Single-screen, non-scrolling dashboard displaying scheduled lessons with date and status filters (`All`, `Booked`, `Cancelled`, `Exams`).
- **Cancellation Management**: Receptionists can mark lessons as `Cancelled` or `No Show` with timestamps and notes, freeing time slots while preserving records.
- **Exam Season Dual-Student Rules**: Permits 2 students per session/tutor when `IsExam` is enabled; blocks disabling Exam status if 2 students are currently booked.
- **Static 6 Rooms & Occupancy Constraints**: Select from 6 static rooms (`R1`–`R6`). Enforces 1 tutor per room and 1 room per tutor at overlapping times.
- **Tutor Daily Load Safeguard**: Caps tutor bookings at 6 per day, requiring explicit receptionist confirmation before saving an overbook assignment.
- **Session Notes**: Record custom notes and cancellation reasons on any tutoring session.

---

## Tech Stack

### Back-End
- **Framework**: ASP.NET Core 8.0 (C#)
- **Architecture**: Layered Architecture (API, Service, Repository, Domain)
- **ORM**: Entity Framework Core 8.0 with Npgsql
- **API Documentation**: RESTful API with Swagger / OpenAPI

### Front-End
- **Framework**: React.JS (Vite)
- **Styling**: Tailwind CSS & Lucide Icons

### Database
- **Database Engine**: PostgreSQL (Neon Cloud DB)

---

### Quick Start (Windows)
Double-click `run.bat` at the project root (or run `run.bat` in Command Prompt / PowerShell) to launch both Backend API and Frontend App in separate terminal windows automatically.

### Manual Setup & Commands
- .NET 8.0 SDK
- Node.js (v18+) & npm

### 1. Back-End Setup
```bash
# Navigate to the backend solution directory
cd BE/BrightPathLessonManager

# Restore dependencies and build the solution
dotnet restore
dotnet build

# Run the backend API server
dotnet run --project BPLM.API
```
The API server will run locally. Swagger API documentation is accessible at `http://localhost:5000/swagger` (or configured port).

### 2. Front-End Setup
```bash
# Navigate to the frontend directory
cd FE

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The web application will open at `http://localhost:5173`.

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/lesson` | Get lessons for target date (defaults to today) |
| `GET` | `/api/lesson/all` | Get all lessons across all dates |
| `GET` | `/api/lesson/{id}` | Get lesson details by ID |
| `POST` | `/api/lesson` | Create a new lesson (accepts `confirmOverbook`) |
| `PUT` | `/api/lesson/{id}` | Update an existing lesson (accepts `confirmOverbook`) |
| `PATCH` | `/api/lesson/{id}/cancel` | Cancel lesson with optional notes |
| `PATCH` | `/api/lesson/{id}/toggle-exam` | Toggle Exam status (blocked if 2 students booked) |
| `DELETE` | `/api/lesson/{id}` | Delete a lesson by ID |