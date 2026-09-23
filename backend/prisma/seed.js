require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database seed...");

  // 1. Learners

  const learner1 = await prisma.learner.upsert({
    where: {
      email: "abhiraj@example.com",
    },
    update: {
      name: "Abhiraj Kumar",
    },
    create: {
      name: "Abhiraj Kumar",
      email: "abhiraj@example.com",
    },
  });

  const learner2 = await prisma.learner.upsert({
    where: {
      email: "rahul@example.com",
    },
    update: {
      name: "Rahul Sharma",
    },
    create: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
    },
  });

  // 2. Courses

  const course1 = await prisma.course.upsert({
    where: {
      id: 1,
    },
    update: {
      title: "Java Backend Fundamentals",
      description: "Core Java concepts required for backend development.",
    },
    create: {
      id: 1,
      title: "Java Backend Fundamentals",
      description: "Core Java concepts required for backend development.",
    },
  });

  const course2 = await prisma.course.upsert({
    where: {
      id: 2,
    },
    update: {
      title: "REST API Development",
      description: "Learn how to design and build RESTful APIs.",
    },
    create: {
      id: 2,
      title: "REST API Development",
      description: "Learn how to design and build RESTful APIs.",
    },
  });

  const course3 = await prisma.course.upsert({
    where: {
      id: 3,
    },
    update: {
      title: "Database Fundamentals",
      description:
        "Learn relational databases, SQL, constraints and transactions.",
    },
    create: {
      id: 3,
      title: "Database Fundamentals",
      description:
        "Learn relational databases, SQL, constraints and transactions.",
    },
  });

  const course4 = await prisma.course.upsert({
    where: {
      id: 4,
    },
    update: {
      title: "Git and Software Engineering",
      description:
        "Learn practical Git workflows and software engineering practices.",
    },
    create: {
      id: 4,
      title: "Git and Software Engineering",
      description:
        "Learn practical Git workflows and software engineering practices.",
    },
  });

  // 3. Lessons

  const lessons = [
    // Course 1 - 4 lessons
    {
      courseId: course1.id,
      title: "Java Basics",
      contentOrUrl: "Introduction to Java programming fundamentals.",
      orderIndex: 1,
    },
    {
      courseId: course1.id,
      title: "Object-Oriented Programming",
      contentOrUrl:
        "Classes, objects, inheritance, polymorphism and encapsulation.",
      orderIndex: 2,
    },
    {
      courseId: course1.id,
      title: "Collections Framework",
      contentOrUrl: "Lists, sets, maps and the Java Collections Framework.",
      orderIndex: 3,
    },
    {
      courseId: course1.id,
      title: "Exception Handling",
      contentOrUrl:
        "Understanding exceptions and writing robust Java programs.",
      orderIndex: 4,
    },

    // Course 2 - 5 lessons
    {
      courseId: course2.id,
      title: "HTTP and REST Fundamentals",
      contentOrUrl: "HTTP methods, status codes and REST principles.",
      orderIndex: 1,
    },
    {
      courseId: course2.id,
      title: "Express.js Basics",
      contentOrUrl: "Building REST APIs using Node.js and Express.",
      orderIndex: 2,
    },
    {
      courseId: course2.id,
      title: "API Validation",
      contentOrUrl:
        "Validating incoming API requests and handling invalid input.",
      orderIndex: 3,
    },
    {
      courseId: course2.id,
      title: "Error Handling",
      contentOrUrl: "Designing consistent API error responses.",
      orderIndex: 4,
    },
    {
      courseId: course2.id,
      title: "API Testing",
      contentOrUrl: "Testing REST APIs using practical API testing techniques.",
      orderIndex: 5,
    },

    // Course 3 - 6 lessons
    {
      courseId: course3.id,
      title: "Relational Database Concepts",
      contentOrUrl: "Tables, relationships, keys and normalization.",
      orderIndex: 1,
    },
    {
      courseId: course3.id,
      title: "Primary and Foreign Keys",
      contentOrUrl: "Understanding primary keys and referential integrity.",
      orderIndex: 2,
    },
    {
      courseId: course3.id,
      title: "SQL Queries",
      contentOrUrl: "SELECT, INSERT, UPDATE and DELETE operations.",
      orderIndex: 3,
    },
    {
      courseId: course3.id,
      title: "Joins",
      contentOrUrl: "INNER JOIN, LEFT JOIN and relational data retrieval.",
      orderIndex: 4,
    },
    {
      courseId: course3.id,
      title: "Indexes and Constraints",
      contentOrUrl: "Indexes, unique constraints and database integrity.",
      orderIndex: 5,
    },
    {
      courseId: course3.id,
      title: "Transactions",
      contentOrUrl:
        "Understanding transactions and maintaining data consistency.",
      orderIndex: 6,
    },

    // Course 4 - 4 lessons
    {
      courseId: course4.id,
      title: "Git Fundamentals",
      contentOrUrl: "Repositories, commits, branches and basic Git commands.",
      orderIndex: 1,
    },
    {
      courseId: course4.id,
      title: "Branching and Merging",
      contentOrUrl: "Working with feature branches and merging changes.",
      orderIndex: 2,
    },
    {
      courseId: course4.id,
      title: "Pull Requests",
      contentOrUrl: "Creating and reviewing pull requests.",
      orderIndex: 3,
    },
    {
      courseId: course4.id,
      title: "Clean Commit Practices",
      contentOrUrl: "Writing meaningful commits and maintaining clean history.",
      orderIndex: 4,
    },
  ];

  // Upsert lessons using the composite unique constraint
  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: {
        courseId_orderIndex: {
          courseId: lesson.courseId,
          orderIndex: lesson.orderIndex,
        },
      },
      update: {
        title: lesson.title,
        contentOrUrl: lesson.contentOrUrl,
      },
      create: lesson,
    });
  }

  // 4. Course Enrollments

  const enrollments = [
    {
      learnerId: learner1.id,
      courseId: course1.id,
    },
    {
      learnerId: learner1.id,
      courseId: course2.id,
    },
    {
      learnerId: learner1.id,
      courseId: course3.id,
    },
    {
      learnerId: learner2.id,
      courseId: course2.id,
    },
  ];

  for (const enrollment of enrollments) {
    await prisma.courseEnrollment.upsert({
      where: {
        learnerId_courseId: {
          learnerId: enrollment.learnerId,
          courseId: enrollment.courseId,
        },
      },
      update: {},
      create: enrollment,
    });
  }

  console.log("Database seed completed successfully.");
  console.log(`Learners: 2`);
  console.log(`Courses: 4`);
  console.log(`Lessons: ${lessons.length}`);
  console.log(`Enrollments: ${enrollments.length}`);
  console.log("Lesson progress: 0");
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
