import express from 'express';
import * as viewController from '../controllers/viewController.js';
import * as authController from '../controllers/authController.js';
import * as bookingController from '../controllers/bookingController.js';
const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base', { documentation: '/api/v1/docs' });
// });
// router.use(authController.isLoggedIn);

router.get(
  '/',
  (req, res, next) => {
    console.log('Root route accessed with path:', req.path);
    next();
  },
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLogin);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-tours',
  authController.protect,
  bookingController.createBookingCheckout,
  viewController.getMyTours
);

router.get('/api/v1/docs', viewController.getApiDocs);
// router.get('/logout', authController.logout);
export default router;
