if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const local = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/gateway";

const ExpressError = require("./utils/ExpressError");
const forumRoute = require("./routes/forum");
const commentRoute = require("./routes/comment");
const userRoute = require("./routes/user");
const User = require("./models/user");

// connect database
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

// app configurations
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

// sanitize
app.use(mongoSanitize());

// CORS
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "https://gateway-web.s3.amazonaws.com"],
    },
  })
);

// session config
const store = connectMongo.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
});

const secret = process.env.SECRET || "secret";

app.use(
  session({
    secret,
    store,
  })
);

const sessionConfig = {
  store,
  name: "s",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // for security
    httpOnly: true,
    // expires in a week
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// home page
app.get("/", (req, res) => {
  res.render("home");
});

// routes
app.use("/user", userRoute);
app.use("/forum", forumRoute);
app.use("/forum/:id/comment", commentRoute);

// 404 error handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// port listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
