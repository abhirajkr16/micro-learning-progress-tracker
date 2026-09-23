

````markdown
# Micro-Learning Progress Tracker

A full-stack micro-learning progress tracker built for the Root2Rise Full Stack Developer technical take-home assignment.

The application allows learners to select a profile, browse courses and ordered lessons, complete lessons, and track their progress.

The main engineering challenge was handling duplicate and concurrent lesson-completion requests safely at the backend/database level.

---

## Tech Stack

### Frontend
- React 19.2.8
- Vite 8.3.0
- JavaScript
- CSS

### Backend
- Node.js
- Express 5.2.1
- Prisma 7.10.0
- PostgreSQL
- `pg` 8.23.0
- CORS
- Nodemon

### Tools
- Git / GitHub
- Postman / REST API testing

---

## Features

- Learner selection
- Course navigation
- Ordered lessons
- Course enrollment
- Lesson completion
- Course progress tracking
- Overall learner progress
- Learner-specific completion state
- Duplicate enrollment protection
- Duplicate completion protection
- Concurrent completion protection
- Loading and error states
- Responsive UI

---

## Project Flow

```text
Learner
   ↓
Select learner
   ↓
Select course
   ↓
View ordered lessons
   ↓
Complete lesson
   ↓
Backend validates request
   ↓
PostgreSQL stores progress
   ↓
Updated progress shown in UI
````

Backend request flow:

```text
React
  ↓
API Service
  ↓
Express Route
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

---

## Database

The application uses five main tables:

```text
Learner
Course
Lesson
CourseEnrollment
LessonProgress
```

Important constraints:

```text
UNIQUE(learner_id, course_id)
```

Prevents duplicate enrollments.

```text
UNIQUE(learner_id, lesson_id)
```

Prevents duplicate lesson-progress records and protects the completion operation from concurrent duplicate requests.

```text
UNIQUE(course_id, order_index)
```

Keeps lesson ordering unique within a course.

---

## Project Structure

```text
micro-learning-progress-tracker/

├── .env
├── .env.example
├── README.md
├── APPROACH.md
├── AI_USAGE.md
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   │
│   ├── test/
│   │   ├── setup.js
│   │   └── lessonProgress.test.js
│   │
│   ├── test-concurrency.js
│   │
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── services/
        ├── App.jsx
        ├── App.css
        ├── index.css
        └── main.jsx
```

---

## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### 1. Enroll Learner

```http
POST /api/enroll
```

Request:

```json
{
  "learnerId": 1,
  "courseId": 1
}
```

Creates an enrollment and prevents duplicate enrollment.

---

### 2. Get Course

```http
GET /api/courses/:id?learnerId=:learnerId
```

Example:

```text
GET /api/courses/1?learnerId=1
```

Returns:

* Course details
* Ordered lessons
* Enrollment status
* Completion state for the selected learner

---

### 3. Complete Lesson

```http
POST /api/lessons/:id/complete
```

Request:

```json
{
  "learnerId": 1
}
```

The backend verifies that the learner is enrolled before creating lesson progress.

Repeated/concurrent completion requests cannot create duplicate progress rows.

---

### 4. Get Learner Progress

```http
GET /api/learners/:id/progress
```

Example:

```text
GET /api/learners/1/progress
```

Returns:

* Learner information
* Enrolled courses
* Total lessons
* Completed lessons
* Course progress
* Overall progress

---

## Prerequisites

Install:

* Node.js
* npm
* PostgreSQL
* Git

Create a PostgreSQL database:

```text
micro_learning_tracker
```

---

## Environment Variables

Create:

```text
.env
```

Example:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/micro_learning_tracker"
PORT=5000
```

Do not commit the real `.env` file.

Use `.env.example` as the configuration reference.

---

## Backend Setup

```bash
cd backend
npm install
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npm run db:seed
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Build Check

```bash
cd frontend
npm run build
```

---

## Test Coverage

The project was manually tested for:

```text
BUILD
LEARNER SWITCH
REFRESH LEARNER
COMPLETION
REFRESH COMPLETION
CROSS-LEARNER
DUPLICATE
CONCURRENCY
INVALID LEARNER
INVALID COURSE
INVALID LESSON
MISSING LEARNER
UNENROLLED COMPLETION
```

Concurrency test result:

```text
Starting concurrent completion test...
Completion rows found: 1
Concurrency test passed.
```

API testing screenshots are available in:

```text
frontend/public/
```

---

## Seed Data

Current seed data contains:

```text
2 learners
4 courses
19 lessons
4 enrollments
```

This satisfies the assignment's minimum seed-data requirement.

---

## Documentation

### `APPROACH.md`

Contains the reasoning behind:

* Database design
* API design
* Backend architecture
* Frontend approach
* Race-condition handling
* Testing approach
* Trade-offs and future improvements

### `AI_USAGE.md`

Contains a short explanation of how ChatGPT and Antigravity were used during development.

---

## Development Phases

The project was developed incrementally:

```text
Phase 0 - Initial Setup
Phase 1 - Database
Phase 2 - Seed Data
Phase 3 - Backend Architecture
Phase 4 - APIs
Phase 5 - Concurrency
Phase 6 - Frontend
Phase 7 - Testing & Documentation
```

