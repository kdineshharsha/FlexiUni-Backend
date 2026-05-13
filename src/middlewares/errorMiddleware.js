const globalErrorHandler = (err, req, res, next) => {
  console.error("ERROR 💥");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
};

export default globalErrorHandler;
