import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import cors from 'cors';
import appError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import compression from 'compression';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.enable('trust proxy');
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
          'https://js.stripe.com',
          "'unsafe-inline'",
        ],
        styleSrc: [
          "'self'",
          'https://unpkg.com',
          'https://fonts.googleapis.com',
          // Add this line
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
        connectSrc: [
          "'self'",
          'ws://localhost:*',
          'wss://localhost:*',
          'https://api.stripe.com',
        ],
        frameSrc: [
          "'self'",
          'https://js.stripe.com',
          'https://hooks.stripe.com',
        ],
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
  next();
});

// 3) ROUTES
import getApiDocs from './docs/apiDocs.js';

// API Documentation route with Pug template
app.get('/api/v1/docs', (req, res) => {
  // Get API documentation with dynamic baseUrl
  const documentation = getApiDocs(req);

  // Render the documentation using the api-docs template
  res.render('api-docs', documentation);
});
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  // console.log(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
  // next(err);
});
app.use(globalErrorHandler);
export default app;

// "start:prod": "cross-env NODE_ENV=production nodemon server.js",
//      $env:PORT=3001; npm run start:prod
