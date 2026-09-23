const express = require("express");

const { enrollLearner } = require("../controllers/enrollmentController");
const validateBody = require("../middleware/validate");

const router = express.Router();

router.post("/", validateBody(["learnerId", "courseId"]), enrollLearner);

module.exports = router;
