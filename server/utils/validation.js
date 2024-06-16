const { check, validationResult } = require('express-validator');

exports.validateRecipeFilters = [
  check('cuisine').optional().isString(),
  check('dietaryRestrictions').optional().isArray(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
