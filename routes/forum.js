const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../aws");

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isPostAuthor, validatePost } = require("../middleware");
const forumControl = require("../controllers/forum");

// file filter to only accept image to multer
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload images only.", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
});

// /forum/
router
  .route("/")
  .get(isLoggedIn, catchAsync(forumControl.index)) // show all posts
  .post(
    isLoggedIn,
    upload.array("image"),
    validatePost,
    catchAsync(forumControl.createPost)
  ); // make the post

// form to make a new post
// /forum/new
router.get("/new", isLoggedIn, forumControl.newPostForm);

// /forum/:id
router
  .route("/:id")
  .get(isLoggedIn, catchAsync(forumControl.showPost)) // show post details
  .put(
    isLoggedIn,
    isPostAuthor,
    upload.array("image"),
    validatePost,
    catchAsync(forumControl.updatePost)
  ) // update the post
  .delete(isLoggedIn, isPostAuthor, catchAsync(forumControl.deletePost)); // delete the post

// edit a post
// /forum/:id/edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isPostAuthor,
  catchAsync(forumControl.editPost)
);

module.exports = router;
