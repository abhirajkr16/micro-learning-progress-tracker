const express = require("express");

const { getCourseById } = require("../controllers/courseController");

const router = express.Router();

router.get("/:id", getCourseById);

module.exports = router;