# AI Usage

I used AI as a development assistant during this project, mainly to understand the assignment better, discuss implementation decisions, debug issues, and review my approach.

I did not treat AI output as something that could simply be copied without understanding or testing it.

---

## Tools I Used

### ChatGPT

I used ChatGPT mainly for:

- Understanding the assignment requirements in detail
- Breaking the project into smaller phases
- Planning the order in which I should build the project
- Understanding the race-condition requirement
- Discussing database constraints
- Debugging backend and frontend issues
- Reviewing API behaviour
- Thinking through edge cases
- Preparing project documentation

The biggest use was helping me turn the assignment into a step-by-step development plan instead of trying to build everything at once.

---

### Antigravity

I also used Antigravity occasionally while debugging.

I mainly used it as another development/debugging assistant when I was stuck on implementation issues.

I still checked the changes locally before keeping them.

---

# How I Used AI

My general process was:

```text
Understand the requirement
        ↓
Discuss possible approach
        ↓
Implement
        ↓
Run the code
        ↓
Find problems
        ↓
Debug
        ↓
Test again
```

I did not want the AI to decide the entire project structure without me understanding it.

---

# Race Condition

One of the most useful parts of using AI was understanding the race-condition requirement.

The assignment was not asking only for:

```text
Disable the Complete button
```

because two HTTP requests can still reach the backend at the same time.

I used AI to understand why a simple:

```text
Check if record exists
        ↓
Insert if not exists
```

can fail under concurrent requests.

That led me to focus on the database constraint:

```prisma
@@unique([learnerId, lessonId])
```

I then tested the solution using concurrent requests instead of assuming that the solution worked.

---

# Debugging

There were also cases where suggestions needed to be checked and corrected.

For example, during Prisma work I had to deal with Prisma 7 configuration and the PostgreSQL adapter.

There were also issues around Prisma's generated names for composite unique constraints.

I had to check the actual Prisma schema/generated API and adjust the implementation rather than blindly using the suggested code.

I also debugged:

- CORS between Vite and Express
- Learner-specific completion state
- Frontend state updates
- Concurrent completion handling

---

# What AI Did Not Replace

I still personally:

- Created and ran the project
- Configured PostgreSQL
- Ran migrations
- Seeded the database
- Tested the APIs
- Tested invalid requests
- Tested duplicate completion
- Tested concurrent requests
- Tested learner isolation
- Built the frontend
- Checked the final UI
- Verified the database state
- Reviewed the final project structure

The final implementation was tested against the actual project rather than being accepted only because an AI suggestion looked correct.

---

# Final Note

The main value I got from AI was faster understanding and debugging.

I used it more like a development assistant and reviewer than as a replacement for understanding the project.