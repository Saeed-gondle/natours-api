import * as reviewController from '../controllers/reviewController.js';
import * as userController from '../controllers/userController.js';
import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
const router = express.Router({ mergeParams: true});

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReview);
router.post('/', protect, restrictTo('user'), reviewController.createReview);

export default router;
