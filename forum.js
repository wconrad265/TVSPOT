const config = require("./lib/config.js");
const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const store = require("connect-loki");
const PgPersistence  = require("./lib/pg-persistence.js");
const catchError = require("./lib/catch-error.js");
const app = express();
const host = config.HOST;
const port = config.PORT;
const LokiStore = store(session);
const POSTS_PER_PAGE = 5; //edit to change the number of posts per a

app.set("views", "./views");
app.set("view engine", "pug");
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: "/",
    secure: false,
  },
  name: "launch-school-todos-session-id",
  resave: false,
  saveUninitialized: true,
  secret: config.SECRET,
  store: new LokiStore({}),
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
})

//extract session info
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  // res.locals.signedIn = req.session.signedIn,
  res.locals.signedIn = req.session.signedIn; //temporary for now to always be logged in;
  res.locals.username = req.session.username;

  delete req.session.flash;
  next();
});

const requiresAuthentication = (req, res, next) => {
  if (!res.locals.signedIn) {
    console.log("UNauthorized");
    res.redirect(302, "/users/sign-in");
  } else {
    next();
  }
}

// redirect user to the first page of the forums
app.get(["/", "/forum"], (req, res) => {
  res.redirect('/forum/1');
});


//this is the home page.
app.get('/forum/:pageNumber',
  requiresAuthentication,
  catchError(async (req, res) => {
    let pageNumber = parseInt(req.params.pageNumber);

    let maxPageNumber = await res.locals.store.getMaxPageNumber(POSTS_PER_PAGE);
    if (!maxPageNumber) throw new Error("No posts found for the specified page");
    if (pageNumber > maxPageNumber) throw new Error("Page not found. NOt posts on this page.")
    
    let posts = await res.locals.store.getPostsForPage(pageNumber, POSTS_PER_PAGE);
    if (!posts) throw new Error("No posts found for the specified page");

    // Assuming the Pug code is in `views/test.pug`
    res.render('forum-posts', {
      posts,
      pageNumber,
      maxPageNumber
    });
  })
);

//Page to add a new post to the forum
app.get("/forum/post/new",
  requiresAuthentication,
  catchError(async (req, res) => {
    res.render('new-post');
  })
);

// Create a new forum post

app.post("/forum/post/new", 
  requiresAuthentication,
  [
    body("postTitle")
    .trim()
    .isLength({ min: 1 })
    .withMessage("A title for the forum post is required.")
    .isLength({ max: 100 })
    .withMessage("Forum title must be between 1 and 100 characters"),
  ],
  catchError(async (req, res) => {
    let errors = validationResult(req);
    let postTitle = req.body.postTitle;
    console.log(errors.array);

    const rerenderNewPost = () => {
      res.render('new-post', {
        flash: req.flash(),
        postTitle
      });
    }

    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      rerenderNewPost();
    } else {
      req.flash("success", 'Your forum post has been created!')
      res.redirect('/forum/1'); // Redirect to the first page of the forum
    }

  })
);

app.get("/users/sign-in", (req, res) => {
  res.render("signin");
})

app.post("/users/sign-in", 
  catchError(async (req, res) => {
  let username = req.body.username.trim();
  let password = req.body.password;

  let authenticated = await res.locals.store.authenticate(username, password);

  if (!authenticated) {
    req.flash("error", "Invalid credentials.");
    res.render("signin", {
      flash: req.flash(),
      username: req.body.username,
    });
  } else {
    req.session.username = username;
    req.session.signedIn = true;
    req.flash("info", "Welcome!");
    res.redirect("/forum");
  }
  })
);

// Error handler
app.use((err, req, res, _next) => {
  console.log(err); // Writes more extensive information to the console log
  res.status(404).render('error');
});

app.use((req, res) => {
  res.status(404).render('error'); // Render your 404 error page (404.pug)
});

app.listen(port, host, () => {
  console.log(`Project is listening on port ${port} !`);
});