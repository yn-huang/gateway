const express = require("express");
const router = express.Router();
const passport = require("passport");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const userControl = require("../controllers/user");

// /user/signup
router
  .route("/signup")
  .get(userControl.showSignup) // show signup
  .post(catchAsync(userControl.createUser)); // create new user

// /user/login
router
  .route("/login")
  .get(userControl.showLogin) // show login
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/user/login",
    }),
    userControl.login
  ); // login

// logout
// /user/logout
router.get("/logout", userControl.logout);

module.exports = router;
