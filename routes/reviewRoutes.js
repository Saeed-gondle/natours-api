import * as reviewController from '../controllers/reviewController.js';
import * as userController from '../controllers/userController.js';
import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    protect,
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(protect, restrictTo('user'), reviewController.deleteReview)
  .patch(protect, restrictTo('user'), reviewController.updateReview);

export default router;
