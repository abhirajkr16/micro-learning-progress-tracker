function getHealth(req, res) {
  res.status(200).json({
    success: true,
    message: "Micro-Learning Progress Tracker API is running",
  });
}

module.exports = {
  getHealth,
};
