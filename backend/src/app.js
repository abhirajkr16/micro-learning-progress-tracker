const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonProgressRoutes = require("./routes/lessonProgressRoutes");
const progressRoutes = require("./routes/progressRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonProgressRoutes);
app.use("/api/learners", progressRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
