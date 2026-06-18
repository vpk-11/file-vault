function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  return res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
}

module.exports = { errorHandler };
