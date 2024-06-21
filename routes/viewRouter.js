const express = require('express');
const viewsController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.get('/', authController.isLoggedIn , viewsController.getOverview);
router.get('/posts', viewsController.getPosts)
router.get('/post/:slug', authController.isLoggedIn, viewsController.getPost);
// router.get('/:catId/posts', authController.isLoggedIn, viewsController.getPostsByCategory)
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/forgot-password', authController.isLoggedIn, viewsController.getForgotPasswordForm);
router.get('/resetPassword/:token', viewsController.getresetPasswordForm);



// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
