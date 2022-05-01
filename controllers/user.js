// user related actions

const User = require("../models/user");

// visit the sign up page
module.exports.showSignup = (req, res) => {
  res.render("users/signup");
};

// create a new user
module.exports.createUser = async (req, res) => {
  try {
    // create a new user
    const { firstName, lastName, email, username, password } = req.body;
    const user = new User({ email, username, firstName, lastName });
    const registeredUser = await User.register(user, password);

    // redirect to login page
    req.flash("success", "Successfully registered, please login!");
    res.redirect("/user/login");
  } catch (e) {
    // error to create new user
    // redirect to signup page
    req.flash("error", e.message);
    res.redirect("/user/signup");
  }
};

// visit the login page
module.exports.showLogin = (req, res) => {
  res.render("users/login");
};

// login
module.exports.login = (req, res) => {
  req.flash("success", "Welcome!");
  // redirect to the last url that triggered the login page
  const redirectUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req, res) => {
  // logout session and redirect to home page
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/");
};
