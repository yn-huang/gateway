const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  isCommentAuthor,
  validateComment,
} = require("../middleware");
const commentControl = require("../controllers/comment");

// make the comment
// /forum/:id/comment/
router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(commentControl.createComment)
);

// delete the comment
// /forum/:id/comment/:commentId
router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthor,
  catchAsync(commentControl.deleteComment)
);

// reply comment
// /forum/:id/comment/:commentId
router.post(
  "/:commentId",
  isLoggedIn,
  validateComment,
  catchAsync(commentControl.replyComment)
);

module.exports = router;
