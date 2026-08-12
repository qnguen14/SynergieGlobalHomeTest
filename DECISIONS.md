# Bright Path Learning Centre - Design Decisions - Nguyen Quang Nguyen

## Phase 1

### Questions
1. How should late cancellations be billed versus tutor compensation?
   If a cancellation happens under 4 hours before the lesson, the family is charged in full and tutor is paid, freeing the slot. If strict automated ledger requirements are needed, a separate financial transaction table would be created. Currently, status tracks Cancelled with cancellation timestamp and notes.
2. What is the policy on overbooking tutors (> 6 bookings/day)?
   Should overbooking be strictly blocked by system error, or soft-capped with receptionist confirmation? A soft-cap with explicit confirmation before submission was implemented to prevent receptionist blockages during emergency days while retaining audit warnings.

### Inconsistencies
- Chosen reading: Dual-student sessions in the same room are allowed only when is_exam is enabled. Without is_exam, 2 students per session or overlapping sessions per tutor are blocked.

### Assumptions
- Static list of 6 rooms: R1, R2, R3, R4, R5, R6.
- A room can hold only 1 tutor at a time.
- A tutor can only teach in 1 room at a time.
- Overlapping bookings for a tutor at the same time are only permitted when marked as an Exam session, though only two students are able to be in the same room with 1 tutor at overlapping times.

## Phase 2

### Features
1. Today View Dashboard: Single-screen non-scrolling dashboard showing today's scheduled lessons.
2. Cancellation Management: Interface to process cancellation requests, capture cancellation timestamps, and record notes.
3. Exam Session Toggle & Dual Student Rules: Allow 2 students per tutor session during exam season while blocking non-exam dual bookings.
4. Room Conflict & Occupancy Validation: Restrict rooms to 6 static rooms, enforcing 1 tutor per room and 1 room per tutor at overlapping times.
5. Tutor Daily Load Safeguard: Cap tutor bookings at 6 per day, requiring receptionist confirmation to exceed.
6. Schedule Cut-off Visibility: Track schedule changes made after the 16:00 cut-off.

### Feature Chosen and Justification
- Chosen Feature: Scheduling Conflict Detection and Session Rules Engine (encompassing Exam Session dual-student control, 6-Room assignment rules, and Tutor 6-booking daily limit confirmation).
- Justification: Overbooking students into two places at once is identified by the owner as a critical system failure. Implementing conflict detection directly solves the primary operational pain point while keeping the system lightweight.
- Left Unbuilt: 
    - Cut-off time change tracking (16:00 notification differential)
    - Automated family messaging (SMS integration), was left empty due to time constrainst, can switch to email if data and time given.

## Phase 3

### Data Model (Given by .csv files)
- Lesson:
  - LessonID (string, PK)
  - Date (DateOnly)
  - StartTime (TimeOnly)
  - DurationMin (string)
  - Student (string)
  - TutorID (string, FK)
  - Room (string)
  - Status (enum: Booked=1, Cancelled=2, NoShow=3)
  - CancelledAt (DateTime?, nullable)
  - IsExam (bool)
  - Notes (string?, nullable)
- Tutor:
  - TutorId (string, PK)
  - TutorName (string)
  - Subject (string)
  - Phone (string)

### Representation of Cancelled / Moved Bookings
- Cancelled bookings maintain their original slot data but set Status = Cancelled and record CancelledAt timestamp along with optional cancellation notes.
- Freeing the slot allows new bookings to be scheduled in that room/time without hard-deleting historical records.

### Enforced Rules (Code vs Database)
- Database:
  - Foreign key constraints between Lesson.TutorID and Tutor.TutorId.
  - Non-null field constraints on mandatory properties (Date, StartTime, Student, Room).
- Application Code (Service Layer):
  - IsExam Rule: Prevent setting IsExam = false if a session already has 2 students booked at the same time.
  - Room Rules: Prevent 2 different tutors in the same room at overlapping times, and 1 tutor in 2 different rooms at overlapping times.
  - Tutor Load Rule: Block creating/updating a 7th+ booking per day for a tutor unless ConfirmOverbook = true is supplied.
  - Reasoning: Time-window overlap logic and conditional confirmations are significantly clearer and easier to maintain in application code than in database triggers or constraints.

### API Shape
- GET /api/lesson?date=YYYY-MM-DD: List lessons for target date (defaults to today).
- GET /api/lesson/all: List all lessons across all dates.
- GET /api/lesson/{id}: Get specific lesson details.
- POST /api/lesson: Create lesson (accepts ConfirmOverbook boolean).
- PUT /api/lesson/{id}: Update lesson (accepts ConfirmOverbook boolean).
- PATCH /api/lesson/{id}/cancel: Cancel lesson with optional notes.
- PATCH /api/lesson/{id}/toggle-exam: Toggle exam status.
- DELETE /api/lesson/{id}: Delete lesson.

### Endpoint Rejected
- POST /api/lesson/batch-reschedule: Rejected in favor of explicit individual PUT updates. Batch endpoints introduce complex partial failure states and unnecessary complexity for a 12-tutor learning centre.

## Phase 4

### What I Would Build With Another Week
1. Automated cut-off differential viewer comparing schedule snapshot at 16:00 against current live schedule.
2. SMS/Email notification payload generator for morning tutor daily schedules.
3. Student attendance ledger tracking billing states for late cancellations vs regular no-shows.

### Known Weaknesses
- Time overlap calculations rely on integer parsing of DurationMin strings.
- Frontend room and tutor list dropdowns are static rather than dynamically hydrated from database reference tables.
- No login meaning only receptionist and owner can access this app.

### Where AI Assistant Helped
- The making of backend DTOs and EFCore service methods.
- Generate a simple React.js Front-end for testing APIs.

### One Suggestion Thrown Away
- Suggestion: Automatically splitting multi-student exam lessons into separate database records.
- Why thrown away: Keeping student names together in one lesson record reflects the receptionist's manual spreadsheet workflow without introducing entity duplication overhead.
