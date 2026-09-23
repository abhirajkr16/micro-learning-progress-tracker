const prisma = require("../config/database");
const AppError = require("../utils/AppError");

async function getLearnerProgress(learnerId) {
  const learner = await prisma.learner.findUnique({
    where: {
      id: learnerId,
    },
  });

  if (!learner) {
    throw new AppError("Learner not found", 404);
  }

  const enrollments = await prisma.courseEnrollment.findMany({
    where: {
      learnerId,
    },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
      },
    },
  });

  const progressRecords = await prisma.lessonProgress.findMany({
    where: {
      learnerId,
    },
  });

  const completedLessonIds = new Set(
    progressRecords.map((progress) => progress.lessonId),
  );

  const courses = enrollments.map((enrollment) => {
    const lessons = enrollment.course.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      contentOrUrl: lesson.contentOrUrl,
      orderIndex: lesson.orderIndex,
      completed: completedLessonIds.has(lesson.id),
    }));

    const completedLessons = lessons.filter(
      (lesson) => lesson.completed,
    ).length;

    return {
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      enrolledAt: enrollment.enrolledAt,
      lessons,
      totalLessons: lessons.length,
      completedLessons,
      progressPercentage:
        lessons.length === 0
          ? 0
          : Math.round((completedLessons / lessons.length) * 100),
    };
  });

  const totalLessons = courses.reduce(
    (total, course) => total + course.totalLessons,
    0,
  );

  const completedLessons = courses.reduce(
    (total, course) => total + course.completedLessons,
    0,
  );

  return {
    learner: {
      id: learner.id,
      name: learner.name,
      email: learner.email,
    },
    courses,
    totalLessons,
    completedLessons,
    progressPercentage:
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100),
  };
}

module.exports = {
  getLearnerProgress,
};
