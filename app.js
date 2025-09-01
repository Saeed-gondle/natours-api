import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewRoutes.js';
import cors from 'cors';
import appError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';

dotenv.config({ path: './config.env' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// First parse the body
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(cookieParser());
// Then apply security middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://unpkg.com',
          'https://cdnjs.cloudflare.com',
          "'unsafe-inline'",
        ],
        styleSrc: [
          "'self'",
          'https://unpkg.com',
          'https://fonts.googleapis.com',
          "'unsafe-inline'",
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: [
          "'self'",
          'data:',
          'https://*.openstreetmap.org',
          'https://*.tile.openstreetmap.org',
          'https://server.arcgisonline.com',
          'https://*.basemaps.cartocdn.com',
        ],
        connectSrc: ["'self'", 'ws://localhost:*', 'wss://localhost:*'],
      },
    },
  })
);
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
  console.log(req.cookies);
  next();
});

// 3) ROUTES

// API Documentation route with Pug template
app.get('/api/v1/docs', (req, res) => {
  const documentation = {
    title: 'Natours API Documentation',
    version: '2.2.0',
    description:
      'Complete REST API for Tours Management Platform with Advanced Geospatial Features',
    baseUrl: `${req.protocol}://${req.get('host')}/api/v1`,

    endpoints: {
      authentication: {
        description: 'User authentication and authorization endpoints',
        routes: [
          {
            method: 'POST',
            path: '/api/v1/users/signup',
            description: 'Register a new user account',
            authentication: 'None',
          },
          {
            method: 'POST',
            path: '/api/v1/users/login',
            description: 'Login with email and password to get JWT token',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/users/logout',
            description: 'Logout current user (clears JWT cookie)',
            authentication: 'None',
          },
          {
            method: 'POST',
            path: '/api/v1/users/forgotPassword',
            description: 'Request password reset token via email',
            authentication: 'None',
          },
          {
            method: 'PATCH',
            path: '/api/v1/users/resetPassword/:token',
            description: 'Reset password using token from email',
            authentication: 'None',
          },
          {
            method: 'PATCH',
            path: '/api/v1/users/updatePassword',
            description: 'Update current user password',
            authentication: 'Bearer Token Required',
          },
        ],
      },

      tours: {
        description:
          'Tour management with advanced filtering and geospatial features',
        routes: [
          {
            method: 'GET',
            path: '/api/v1/tours',
            description:
              'Get all tours with advanced filtering, sorting, and pagination',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/top-5-cheap',
            description: 'Get top 5 cheapest tours (pre-configured alias)',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/tour-stats',
            description:
              'Get comprehensive tour statistics aggregated by difficulty level',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/monthly-plan/:year',
            description:
              'Get monthly tour distribution and planning data for specific year',
            authentication: 'Bearer Token Required (admin/lead-guide roles)',
          },
          {
            method: 'GET',
            path:
              '/api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit',
            description:
              'Find tours within specified distance from coordinates (geospatial query)',
            authentication: 'None',
            example:
              '/api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/distances/:latlng/unit/:unit',
            description:
              'Calculate distances from coordinates to all tour starting points',
            authentication: 'None',
            example: '/api/v1/tours/distances/40.7128,-74.0060/unit/km',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/:id',
            description:
              'Get single tour by ID with populated reviews and guides',
            authentication: 'None',
          },
          {
            method: 'POST',
            path: '/api/v1/tours',
            description: 'Create a new tour',
            authentication: 'Bearer Token Required (admin/lead-guide only)',
          },
          {
            method: 'PATCH',
            path: '/api/v1/tours/:id',
            description: 'Update tour by ID',
            authentication: 'Bearer Token Required (admin/lead-guide only)',
          },
          {
            method: 'DELETE',
            path: '/api/v1/tours/:id',
            description: 'Delete tour by ID',
            authentication: 'Bearer Token Required (admin/lead-guide only)',
          },
        ],
      },

      users: {
        description: 'User management and profile endpoints',
        routes: [
          {
            method: 'GET',
            path: '/api/v1/users/me',
            description: 'Get current user profile',
            authentication: 'Bearer Token Required',
          },
          {
            method: 'PATCH',
            path: '/api/v1/users/updateMe',
            description: 'Update current user name and email (not password)',
            authentication: 'Bearer Token Required',
          },
          {
            method: 'GET',
            path: '/api/v1/users',
            description: 'Get all users',
            authentication: 'Bearer Token Required (admin only)',
          },
          {
            method: 'POST',
            path: '/api/v1/users',
            description: 'Create new user (admin function)',
            authentication: 'Bearer Token Required (admin only)',
          },
          {
            method: 'GET',
            path: '/api/v1/users/:id',
            description: 'Get user by ID',
            authentication: 'Bearer Token Required (admin only)',
          },
          {
            method: 'PATCH',
            path: '/api/v1/users/:id',
            description: 'Update user by ID',
            authentication: 'Bearer Token Required (admin only)',
          },
          {
            method: 'DELETE',
            path: '/api/v1/users/:id',
            description: 'Delete user by ID',
            authentication: 'Bearer Token Required (admin only)',
          },
        ],
      },

      reviews: {
        description: 'Review management with automatic ratings calculation',
        routes: [
          {
            method: 'GET',
            path: '/api/v1/reviews',
            description: 'Get all reviews with pagination and filtering',
            authentication: 'None',
          },
          {
            method: 'GET',
            path: '/api/v1/tours/:tourId/reviews',
            description: 'Get all reviews for a specific tour',
            authentication: 'None',
          },
          {
            method: 'POST',
            path: '/api/v1/tours/:tourId/reviews',
            description: 'Create a review for a specific tour',
            authentication: 'Bearer Token Required (user role only)',
            note:
              'Tour and user are automatically set. Users can only review each tour once.',
          },
          {
            method: 'GET',
            path: '/api/v1/reviews/:id',
            description: 'Get single review by ID',
            authentication: 'None',
          },
          {
            method: 'PATCH',
            path: '/api/v1/reviews/:id',
            description: 'Update review (own reviews only)',
            authentication: 'Bearer Token Required (user role only)',
            note: 'Users can only update their own reviews',
          },
          {
            method: 'DELETE',
            path: '/api/v1/reviews/:id',
            description: 'Delete review (own reviews only)',
            authentication: 'Bearer Token Required (user role only)',
            note:
              'Users can only delete their own reviews. Automatically recalculates tour ratings after deletion',
          },
        ],
      },
    },

    geospatialFeatures: {
      description:
        'Advanced location-based queries using MongoDB geospatial operators and 2dsphere indexes',
      availableEndpoints: [
        'GET /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit - Find tours within radius',
        'GET /api/v1/tours/distances/:latlng/unit/:unit - Calculate distances to all tours',
      ],
      supportedQueries: [
        'Find tours within specific distance from coordinates (radius search)',
        'Calculate distances from a point to all tour starting locations',
        'GeoJSON Point format for precise coordinate handling',
        'Support for miles and kilometers distance units',
      ],
      coordinateFormat: 'latitude,longitude (e.g., 34.111745,-118.113491)',
      useCases: [
        'Find tours near user location',
        'Search tours within travel distance',
        'Calculate travel distances for trip planning',
        'Location-based tour recommendations',
      ],
      examples: {
        findToursNearLosAngeles:
          '/api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi',
        findToursNearNewYork:
          '/api/v1/tours/tours-within/200/center/40.7128,-74.0060/unit/km',
        calculateDistancesFromMiami:
          '/api/v1/tours/distances/25.7617,-80.1918/unit/mi',
        calculateDistancesFromLondon:
          '/api/v1/tours/distances/51.5074,-0.1278/unit/km',
      },
    },
  };

  res.render('api-docs', documentation);
});
app.use('/', viewRouter);
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
