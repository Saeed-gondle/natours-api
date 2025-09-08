import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as factory from './handleFactory.js';

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Initialize Stripe (environment variables are loaded at runtime)
  if (!process.env.STRIPE_SECRET_KEY) {
    return next(
      new AppError('Stripe configuration error. Please contact support.', 500)
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // 2) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  // 3) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
          unit_amount: tour.price * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  // 4) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
export const createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) {
    return next();
  }

  // Create a new booking in the database
  await Booking.create({
    tour,
    user,
    price,
  });
  res.redirect(req.originalUrl.split('?')[0]);
});
export const createBooking = factory.createOne(Booking);
export const getBooking = factory.getOne(Booking);
export const getAllBookings = factory.getAll(Booking);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);
// `${req.protocol}://${req.get('host')}/my-tours/?tour=${
//       req.params.tourId
//     }&user=${req.user.id}&price=${tour.price}`
