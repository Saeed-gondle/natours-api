import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getOverview = catchAsync(async (req, res, next) => {
  console.log('getOverview controller called');

  try {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    console.log(`Found ${tours.length} tours`);

    // 2) Build template
    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    });
  } catch (error) {
    console.error('Error in getOverview:', error);
    return next(
      new AppError('Error loading tours. Please try again later.', 500)
    );
  }
});

export const getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

export const getLogin = (req, res, next) => {
  // If user is already logged in, redirect to overview
  if (res.locals.user) {
    return res.redirect('/');
  }

  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

export const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

export const getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

export const getApiDocs = (req, res) => {
  res.status(200).render('api-docs', {
    title: 'Natours API Documentation',
  });
};
export const getMyTours = catchAsync(async (req, res, next) => {
  // console.log('User:', req.user);

  // 1) Find all bookings WITHOUT population first
  const bookings = await Booking.find({ user: req.user.id });
  console.log('Bookings found:', bookings);

  // 2) Find all tours with the booked IDs mmnmmjxdc
  const tourIds = bookings.map(el => el.tour);

  const tours = await Tour.find({ _id: { $in: tourIds } });

  // 3) Build template
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
