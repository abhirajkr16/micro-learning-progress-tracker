const enrollmentService = require("../services/enrollmentService");

async function enrollLearner(req, res, next) {
  try {
    const { learnerId, courseId } = req.body;

    const enrollment = await enrollmentService.enrollLearner(
      Number(learnerId),
      Number(courseId),
    );

    res.status(201).json({
      success: true,
      message: "Learner enrolled successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  enrollLearner,
};
