const prisma = require("../config/database");
const AppError = require("../utils/AppError");

async function enrollLearner(learnerId, courseId) {
  // check whether the learner exists
  const learner = await prisma.learner.findUnique({
    where: {
      id: learnerId,
    },
  });

  if (!learner) {
    throw new AppError("Learner not found", 404);
  }

  // check whether the course exists
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // check whether the learner is already enrolled
  const existingEnrollment = await prisma.courseEnrollment.findUnique({
    where: {
      learnerId_courseId: {
        learnerId: learnerId,
        courseId: courseId,
      },
    },
  });

  if (existingEnrollment) {
    throw new AppError("Learner is already enrolled in this course", 409);
  }

  const enrollment = await prisma.courseEnrollment.create({
    data: {
      learnerId: learnerId,
      courseId: courseId,
    },
  });

  return enrollment;
}

module.exports = {
  enrollLearner,
};
