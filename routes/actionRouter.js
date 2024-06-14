const express = require('express')
const actionController = require('./../controllers/actionController');
const commentController = require('./../controllers/commentController');
const authController = require('./../controllers/authController');
const router = express.Router();


router.use(authController.protect);

router
    .route('/:postId')
    .post(commentController.setPostUserIds, actionController.createAction)

module.exports = router;