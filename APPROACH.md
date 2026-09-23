# Approach

## 1. How I approached the assignment

I first broke the assignment into smaller parts instead of trying to build the complete application at once.

My development order was:

```text
Understand requirements
        ↓
Initial project setup
        ↓
Database design
        ↓
Seed data
        ↓
Backend architecture
        ↓
Required APIs
        ↓
Race-condition handling
        ↓
Frontend
        ↓
Testing
        ↓
Documentation
```

This helped me verify each major part before moving to the next one.

---

# 2. Understanding the requirements

The main things I identified from the assignment were:

- Learners
- Courses
- Ordered lessons
- Course enrollments
- Lesson completion
- Progress calculation
- Four required APIs
- Frontend interaction
- Loading/error states
- Database-level duplicate protection
- Concurrent completion handling

The race-condition requirement was the part I paid the most attention to because simply disabling a button in React would not solve it.

---

# 3. Database Design

I used PostgreSQL because the data has clear relationships and the assignment specifically requires a relational database.

I divided the data into five tables:

```text
Learners
Courses
Lessons
CourseEnrollments
LessonProgress
```

I kept enrollment and lesson progress separate.

For example:

```text
Learner → Course
```

is represented through:

```text
CourseEnrollment
```

while:

```text
Learner → completed Lesson
```

is represented through:

```text
LessonProgress
```

This makes the relationships easier to maintain and query.

---

# 4. Important Database Constraints

I used database constraints for cases where correctness should not depend on the frontend.

### Duplicate enrollment

```prisma
@@unique([learnerId, courseId])
```

This means the same learner cannot be enrolled in the same course twice.

### Duplicate lesson completion

```prisma
@@unique([learnerId, lessonId])
```

This is the most important constraint in the project.

It guarantees that a learner cannot have two progress rows for the same lesson.

### Lesson ordering

```prisma
@@unique([courseId, orderIndex])
```

This prevents duplicate lesson positions within the same course.

---

# 5. Backend Architecture

I separated the backend into:

```text
Routes
Controllers
Services
Database
Middleware
Utils
```

The flow is:

```text
Request
  ↓
Route
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

I used services for the main business logic so that database operations were not directly written inside every controller.

For example, the lesson completion controller mainly handles the HTTP request, while the service handles the actual completion logic.

---

# 6. API 1 — Enroll Learner

Endpoint:

```text
POST /api/enroll
```

I treated enrollment as a separate operation because lesson completion should only be allowed for an enrolled learner.

The basic flow is:

```text
Receive learnerId + courseId
        ↓
Validate learner
        ↓
Validate course
        ↓
Check/create enrollment
        ↓
Return response
```

The database unique constraint handles duplicate enrollment at the data level.

---

# 7. API 2 — Get Course

Endpoint:

```text
GET /api/courses/:id
```

The purpose of this API is to return the selected course together with its lessons.

Lessons are sorted by:

```text
orderIndex ASC
```

Later, when learner-specific completion was added, I also used the selected learner ID so the API could tell the frontend which lessons were already completed by that learner.

The response therefore represents both:

```text
Course structure
+
Learner completion state
```

---

# 8. API 3 — Complete Lesson

Endpoint:

```text
POST /api/lessons/:id/complete
```

This was the most important API.

The flow is:

```text
Receive lessonId + learnerId
        ↓
Check learner
        ↓
Check lesson
        ↓
Find lesson's course
        ↓
Check learner enrollment
        ↓
Create progress
        ↓
Return result
```

If the lesson has already been completed, the backend does not create another progress row.

---

# 9. Race Condition

The assignment specifically gives the example of two identical requests arriving at the same time.

For example:

```text
Request A ──────┐
                ├── Complete Lesson 1
Request B ──────┘
```

A bad implementation could do:

```text
Request A → check → no row
Request B → check → no row

Request A → insert
Request B → insert
```

That could create two rows.

I did not want the solution to depend only on:

```text
Disable the button
```

because the frontend cannot control every request that reaches the backend.

---

# 10. My Concurrency Solution

The important part of my solution is:

```prisma
@@unique([learnerId, lessonId])
```

The database itself does not allow two progress records for the same learner and lesson.

The backend also handles the duplicate condition and returns a safe response.

So even if:

```text
10 requests
```

are sent for the same learner and lesson, the database can contain only:

```text
1 progress row
```

The frontend button disabling is only for better user experience.

The actual guarantee comes from the database.

---

# 11. API 4 — Learner Progress

Endpoint:

```text
GET /api/learners/:id/progress
```

I used this API to calculate the learner's progress across enrolled courses.

For each course I calculate:

```text
completed lessons
total lessons
progress percentage
```

The calculation is:

```text
completed lessons / total lessons × 100
```

The same data is also aggregated to calculate overall learner progress.

---

# 12. Frontend Approach

I kept the frontend relatively simple because the application is small.

I used React state instead of adding Redux or another state-management library.

Main state includes:

```text
learnerId
courseId
course
progress
loading
courseLoading
completingLesson
error
```

---

# 13. Learner Selection

The assignment allows simplified authentication or mock user selection.

Instead of implementing a complete authentication system, I used learner selection.

The selected learner ID is also stored in:

```text
localStorage
```

so refreshing the page does not immediately reset the selected learner.

---

# 14. Course UI

The course selector allows the learner to move between courses.

The UI also indicates whether the selected learner is enrolled in a course.

When changing courses, I use a separate loading state so the entire application does not disappear while the new course is being loaded.

---

# 15. Lesson Completion UI

Each lesson has a completion button.

The frontend does three things when the button is clicked:

```text
Send completion request
        ↓
Update selected lesson state
        ↓
Fetch latest learner progress
```

The button is disabled while the request is being processed.

If the request fails, the error is displayed to the user.

---

# 16. Progress UI

The progress card shows the selected course's progress.

For example:

```text
2 of 4 lessons
50%
```

The progress bar is based on the percentage returned by the backend.

The backend remains the source of truth.

---

# 17. Loading and Error Handling

I added separate states for:

```text
Initial loading
Course loading
Lesson completion
API error
Non-enrolled course
```

This was important because the assignment specifically asks for basic loading, empty, and API error handling.

---

# 18. Testing Approach

I did not test only the successful cases.

I tested:

```text
Build
Learner switching
Refresh learner
Lesson completion
Refresh after completion
Cross-learner isolation
Duplicate completion
Concurrency
Invalid learner
Invalid course
Invalid lesson
Missing learner
Unenrolled completion
```

The concurrency test was especially important.

The result was:

```text
Completion rows found: 1
Concurrency test passed.
```

---

# 19. Trade-offs

Because this is a take-home prototype, I kept some parts intentionally simple.

### Authentication

I used mock learner selection instead of implementing a complete authentication system because the assignment explicitly allows simplified authentication.

### State management

I used React state instead of Redux because the application does not have enough shared state to justify another dependency.

### API client

I kept a small custom fetch wrapper instead of adding Axios because the current API requirements are small.

### UI

I focused on a clean functional UI rather than spending most of the development time on a large design system.

---

# 20. What I would improve with more time

If I had another week, I would improve:

- Real authentication
- Better API validation
- Automated API/integration test setup
- More reusable frontend hooks
- API documentation with OpenAPI
- Better environment configuration
- More comprehensive UI testing
- Production deployment
- CI/CD
- Admin/course management
- Better accessibility testing

I would keep the database-level uniqueness constraint because it is important for data integrity.

---

# 21. AI-Assisted Development

I used AI mainly as a development assistant.

The main uses were:

- Understanding the assignment
- Breaking the work into phases
- Discussing the race condition
- Debugging implementation issues
- Reviewing approaches
- Helping with documentation

I still tested the implementation myself and changed suggestions when they did not match the actual project.

More details are in:

```text
AI_USAGE.md
```