const lessonProgressService = require("../services/lessonProgressService");

async function completeLesson(req, res, next) {
  try {
    const lessonId = Number(req.params.id);
    const learnerId = Number(req.body.learnerId);

    const result = await lessonProgressService.completeLesson(
      lessonId,
      learnerId,
    );

    res.status(result.alreadyCompleted ? 200 : 201).json({
      success: true,
      message: result.alreadyCompleted
        ? "Lesson was already completed"
        : "Lesson completed successfully",
      data: result.progress,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  completeLesson,
};
