import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import cors from 'cors';
import appError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
dotenv.config({ path: './config.env' });
const app = express();

// First parse the body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Then apply security middlewares
app.use(helmet());
app.use(cors());
app.use(
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  })
);
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// console.log(process.env.NODE_ENV);
app.use(express.static(`${__dirname}/public`));
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.get('/', (req, res) => {
  // Check if user wants HTML documentation
  if (
    req.query.format === 'html' ||
    req.headers.accept?.includes('text/html')
  ) {
    return res.sendFile(path.join(__dirname, 'public', 'api-docs.html'));
  }

  // Otherwise return JSON documentation
  const documentation = {
    title: 'Natours API Documentation',
    version: '1.0.0',
    description:
      'Complete REST API for Tours, Users, Reviews and Authentication',
    baseUrl: `${req.protocol}://${req.get('host')}/api/v1`,
    htmlDocs: `${req.protocol}://${req.get('host')}/?format=html`,
    endpoints: {
      authentication: {
        description: 'User authentication and authorization endpoints',
        routes: [
          {
            method: 'POST',
            path: '/api/v1/users/signup',
            description: 'Register a new user',
            authentication: 'None',
            requestBody: {
              name: 'string (required)',
              email: 'string (required)',
              password: 'string (required, min 8 chars)',
              passwordConfirm: 'string (required, must match password)',
            },
            example: {
              name: 'John Doe',
              email: 'john@example.com',
              password: 'password123',
              passwordConfirm: 'password123',
            },
          },
          {
            method: 'POST',
            path: '/api/v1/users/login',
            description: 'Login with email and password',
            authentication: 'None',
            requestBody: {
              email: 'string (required)',
              password: 'string (required)',
            },
            example: {
              email: 'john@example.com',
              password: 'password123',
            },
          },
          {
            method: 'POST',
            path: '/api/v1/users/forgotPassword',
            description: 'Request password reset token',
            authentication: 'None',
            requestBody: {
              email: 'string (required)',
            },
          },
          {
            method: 'PATCH',
            path: '/api/v1/users/resetPassword/:token',
            description: 'Reset password using token',
            authentication: 'None',
            requestBody: {
              password: 'string (required)',
              passwordConfirm: 'string (required)',
            },
          },
          {
            method: 'PATCH',
            path: '/api/v1/users/updatePassword',
            description: 'Update current user password',
            authentication: 'Bearer Token Required',
            requestBody: {
              passwordCurrent: 'string (required)',
              password: 'string (required)',
              passwordConfirm: 'string (required)',
            },
          },
        ],
      },
      tours: {
        description: 'Tour management endpoints',
        routes: [
          {
            method: 'GET',
            path: '/api/v1/tours',
            description: 'Get all tours with filtering, sorting, pagination',
            authentication: 'Bearer Token Required',
            queryParams: {
              page: 'number (default: 1)',
              limit: 'number (default: 100)',
              sort: "string (e.g., 'price', '-createdAt')",
              fields: "string (e.g., 'name,price,duration')",
              filter: 'object (e.g., difficulty=easy, price[gte]=500)',
            },
            example:
              '/api/v1/tours?difficulty=easy&price[gte]=500&sort=price&fields=name,price,duration&page=1&limit=10',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/top-5-cheap',
            description: 'Get top 5 cheapest tours (aliased route)',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/tour-stats',
            description: 'Get tour statistics aggregated by difficulty',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/monthly-plan/:year',
            description: 'Get monthly tour plan for a specific year',
            authentication: 'None',
            example: '/api/v1/tours/monthly-plan/2024',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/:id',
            description: 'Get a single tour by ID with populated reviews',
            authentication: 'None',
            example: '/api/v1/tours/6123456789abcdef12345678',
          },
          {
            method: 'POST',
            path: '/api/v1/tours',
            description: 'Create a new tour',
            authentication: 'Bearer Token Required',
            requestBody: {
              name: 'string (required, unique)',
              duration: 'number (required)',
              maxGroupSize: 'number (required)',
              difficulty: 'string (required: easy, medium, difficult)',
              ratingsAverage: 'number (1-5)',
              ratingsQuantity: 'number',
              price: 'number (required)',
              summary: 'string (required)',
              description: 'string',
              imageCover: 'string',
              images: 'array of strings',
              startDates: 'array of dates',
              locations: 'array of location objects',
            },
          },
          {
            method: 'PATCH',
            path: '/api/v1/tours/:id',
            description: 'Update a tour by ID',
            authentication: 'Bearer Token Required',
          },
          {
            method: 'DELETE',
            path: '/api/v1/tours/:id',
            description: 'Delete a tour by ID',
            authentication: 'Bearer Token Required (admin or lead-guide only)',
          },
        ],
      },
      users: {
        description: 'User management endpoints',
        routes: [
          {
            method: 'GET',
            path: '/api/v1/users',
            description: 'Get all users',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/users/:id',
            description: 'Get a single user by ID',
            authentication: 'None',
            note: 'Route not yet implemented',
          },
          {
            method: 'POST',
            path: '/api/v1/users',
            description: 'Create a new user',
            authentication: 'None',
            note: 'Route not yet implemented',
          },
          {
            method: 'PATCH',
            path: '/api/v1/users/:id',
            description: 'Update a user by ID',
            authentication: 'None',
            note: 'Route not yet implemented',
          },
          {
            method: 'DELETE',
            path: '/api/v1/users/:id',
            description: 'Delete a user by ID',
            authentication: 'None',
            note: 'Route not yet implemented',
          },
        ],
      },
      reviews: {
        description: 'Review management endpoints',
        routes: [
          {
            method: 'GET',
            path: '/api/v1/reviews',
            description: 'Get all reviews',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/:tourId/reviews',
            description: 'Get all reviews for a specific tour',
            authentication: 'None',
            example: '/api/v1/tours/6123456789abcdef12345678/reviews',
          },
          {
            method: 'GET',
            path: '/api/v1/reviews/:id',
            description: 'Get a single review by ID',
            authentication: 'None',
          },
          {
            method: 'POST',
            path: '/api/v1/reviews',
            description: 'Create a new review',
            authentication: 'Bearer Token Required (user role only)',
            requestBody: {
              review: 'string (required)',
              rating: 'number (required, 1-5)',
              tour: 'ObjectId (required)',
              user: 'ObjectId (auto-filled from authenticated user)',
            },
          },
          {
            method: 'POST',
            path: '/api/v1/tours/:tourId/reviews',
            description: 'Create a review for a specific tour',
            authentication: 'Bearer Token Required (user role only)',
            requestBody: {
              review: 'string (required)',
              rating: 'number (required, 1-5)',
            },
          },
        ],
      },
    },
    authentication: {
      description: 'Most endpoints require Bearer token authentication',
      header: 'Authorization: Bearer <your-jwt-token>',
      roles: ['user', 'guide', 'lead-guide', 'admin'],
      tokenExpiry: '90 days',
      rateLimiting: '100 requests per hour per IP',
    },
    responseFormat: {
      success: {
        status: 'success',
        results: 'number (for arrays)',
        data: 'object containing the response data',
      },
      error: {
        status: 'error' || 'fail',
        message: 'string describing the error',
      },
    },
    examples: {
      successResponse: {
        status: 'success',
        results: 3,
        data: {
          tours: ['tour objects array'],
        },
      },
      errorResponse: {
        status: 'fail',
        message: 'Invalid input data',
      },
    },
  };

  res.status(200).json(documentation);
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  // console.log(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
  // next(err);
});
app.use(globalErrorHandler);
export default app;
