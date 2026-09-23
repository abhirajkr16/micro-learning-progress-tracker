const prisma = require("../config/database");
const AppError = require("../utils/AppError");

async function getCourseById(courseId) {
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

  return course;
}

module.exports = {
  getCourseById,
};
