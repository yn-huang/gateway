const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCommentAuthor, validateComment } = require('../middleware');
const commentControl = require('../controllers/comment');

//make the comment
router.post('/', isLoggedIn, validateComment, catchAsync(commentControl.createComment));

//delete the comment
router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(commentControl.deleteComment));

//reply comment
router.post('/:commentId', isLoggedIn, validateComment, catchAsync(commentControl.replyComment));

module.exports = router;