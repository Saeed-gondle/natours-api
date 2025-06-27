class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
// Compare this snippet from controllers/tourController.js: 
// import Tour from './../models/tourModel.js';
// import APIFeatures from './../utils/apiFeatures.js';
//