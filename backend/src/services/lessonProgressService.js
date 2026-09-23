const prisma = require("../config/database");
const AppError = require("../utils/AppError");

async function completeLesson(lessonId, learnerId) {
  // check whether the learner exists
  const learner = await prisma.learner.findUnique({
    where: {
      id: learnerId,
    },
  });

  if (!learner) {
    throw new AppError("Learner not found", 404);
  }

  // check whether the lesson exists
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  // check whether the learner is enrolled in the course
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: {
      learnerId_courseId: {
        learnerId,
        courseId: lesson.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new AppError("Learner is not enrolled in this course", 403);
  }

  try {
    const progress = await prisma.lessonProgress.create({
      data: {
        learnerId,
        lessonId,
      },
    });

    return {
      progress,
      alreadyCompleted: false,
    };
  } catch (error) {
    // The database unique constraint handles concurrent duplicate requests
    if (error.code === "P2002") {
      const existingProgress = await prisma.lessonProgress.findUnique({
        where: {
          learnerId_lessonId: {
            learnerId,
            lessonId,
          },
        },
      });

      return {
        progress: existingProgress,
        alreadyCompleted: true,
      };
    }

    throw error;
  }
}

module.exports = {
  completeLesson,
};
