function validateBody(requiredFields) {
  return (req, res, next) => {
    for (const field of requiredFields) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    next();
  };
}

module.exports = validateBody;
