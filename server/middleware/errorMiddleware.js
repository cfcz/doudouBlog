//Unsupported (404) routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Error handling middleware
const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Internal Server Error" });
};

module.exports = { notFound, errorHandler };
