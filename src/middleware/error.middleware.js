const logger = require('../helpers/logger');
const { errorResponse } = require('../helpers/response.helper');

const errorHandler = (err, req, res, next) => {
  logger.error(`[ERROR] ${err.message}`, err);

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific errors
  switch (err.name) {
    case 'ValidationError':
      statusCode = 400;
      message = err.details?.map(d => d.message).join(', ') || 'Validation Error';
      break;
    case 'JsonWebTokenError':
      statusCode = 401;
      message = 'Unauthorized';
      break;
    case 'TokenExpiredError':
      statusCode = 401;
      message = 'Token Expired';
      break;
    case 'SyntaxError':
      if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Invalid JSON payload';
      }
      break;
    default:
      // Handle Knex errors (MySQL/PostgreSQL-specific)
      if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') {
        statusCode = 400;
        message = 'Duplicate Entry';
      } else if (err.code === '23503') {
        statusCode = 400;
        message = 'Foreign Key Violation';
      } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'Invalid Reference';
      }
      break;
  }

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    return errorResponse(res, statusCode, message, { stack: err.stack });
  }

  return errorResponse(res, statusCode, message);
};

module.exports = errorHandler;
