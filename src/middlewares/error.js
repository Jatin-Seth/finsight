const notFound = (req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
};

module.exports = { notFound, errorHandler };
