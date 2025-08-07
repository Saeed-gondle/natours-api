import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
const router = express.Router();
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/logout').get(authController.logout);
// router.use(authController.protect);
router.use(authController.protect);
router
  .route('/updatePassword')
  .patch( authController.updatePassword);
router
  .route('/me')
  .get(userController.getMe, userController.getUser);
  router.route('/updateMe')
  .patch(
    userController.updateMe
  );
  router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.restrictTo('admin'),
    userController.deleteUser
  );

export default router;
