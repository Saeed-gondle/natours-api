import express from 'express';
import * as bookingController from './../controllers/bookingController.js';
import * as authController from './../controllers/authController.js';
import * as viewController from './../controllers/viewController.js';

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);
router
  .route('/')
  .post(bookingController.createBooking)
  .get(bookingController.getAllBookings);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

export default router;
