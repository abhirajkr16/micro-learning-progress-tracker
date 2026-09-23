const progressService = require("../services/progressService");

async function getLearnerProgress(req, res, next) {
  try {
    const learnerId = Number(req.params.id);

    const progress = await progressService.getLearnerProgress(learnerId);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLearnerProgress,
};
