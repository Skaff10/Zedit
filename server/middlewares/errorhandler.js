const errorHandler = (err, req, res, next) => {
  console.log(err);
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    details: err.details || undefined,
  });
};

module.exports = errorHandler;
