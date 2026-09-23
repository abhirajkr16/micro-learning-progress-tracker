const prisma = require("../config/database");

const AppError = require("../utils/AppError");

async function getCourseById(courseId, learnerId) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      lessons: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  let completedLessonIds = new Set();

  if (learnerId) {
    const progress = await prisma.lessonProgress.findMany({
      where: {
        learnerId,
        lesson: {
          courseId,
        },
      },
      select: {
        lessonId: true,
      },
    });

    completedLessonIds = new Set(progress.map((item) => item.lessonId));
  }

  const lessons = course.lessons.map((lesson) => ({
    ...lesson,
    completed: completedLessonIds.has(lesson.id),
  }));

  return {
    ...course,
    lessons,
  };
}

module.exports = {
  getCourseById,
};
