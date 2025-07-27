const joi = require('joi');

const validateTokenAddress = (req, res, next) => {
  const schema = joi.object({
    address: joi.string().min(32).max(44).required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid token address',
      details: error.details[0].message
    });
  }

  next();
};

const validateQueryParams = (req, res, next) => {
  const schema = joi.object({
    limit: joi.number().integer().min(1).max(1000).optional(),
    offset: joi.number().integer().min(0).optional(),
    type: joi.string().valid('buy', 'sell', 'transfer', 'swap', 'all').optional(),
    protocol: joi.string().optional(),
    timeRange: joi.string().valid('1h', '24h', '7d', '30d', 'all').optional()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid query parameters',
      details: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateTokenAddress,
  validateQueryParams
};
