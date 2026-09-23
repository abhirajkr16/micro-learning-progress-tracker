const express = require("express");

const {
  getLearnerProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.get("/:id/progress", getLearnerProgress);

module.exports = router;