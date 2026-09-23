const express = require("express");

const { completeLesson } = require("../controllers/lessonProgressController");

const validateBody = require("../middleware/validate");

const router = express.Router();

router.post("/:id/complete", validateBody(["learnerId"]), completeLesson);

module.exports = router;
