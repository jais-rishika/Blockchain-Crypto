export const validateBody = (requiredFields = []) => (req, res, next) => {
  const missing = requiredFields.filter((f) => req.body?.[f] === undefined);

  if (missing.length) {
    return res.status(400).json({
      type: 'error',
      message: `Missing required fields: ${missing.join(', ')}`
    });
  }
  next();
};