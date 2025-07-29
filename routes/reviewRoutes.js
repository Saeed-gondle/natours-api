import * as reviewController from '../controllers/reviewController.js';
import * as userController from '../controllers/userController.js';
import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
const router = express.Router({ mergeParams: true });

router
  .get('/', reviewController.getAllReviews)
  .post(
    protect,
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router.get('/:id', reviewController.getReview);

export default router;
