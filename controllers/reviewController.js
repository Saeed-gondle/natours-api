import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { deleteOne, createOne } from './handleFactory.js';
export const setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
export const getAllReviews = catchAsync(async (req, res, next) => {
  // Allow nested routes
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
export const getReview = catchAsync(async (req, res, next) => {
  // if (!req.body.tour) req.req.body.tour =
  //                       req.body.tour;
  //                       req.body.reviewId;
  // // if(!re)
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
export const createReview = createOne(Review);
export const deleteReview = deleteOne(Review);