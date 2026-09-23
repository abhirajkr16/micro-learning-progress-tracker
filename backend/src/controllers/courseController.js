const courseService = require("../services/courseService");

async function getCourseById(req, res, next) {
  try {
    const courseId = Number(req.params.id);

    const course = await courseService.getCourseById(courseId);

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCourseById,
};
