const express = require("express");

const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use("/api/health", healthRoutes);

app.use(errorHandler);

module.exports = app;
