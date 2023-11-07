const config = require("./lib/config.js");
const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const store = require("connect-loki");
const PgPersistence  = require("./lib/pg-persistence.js");
const catchError = require("./lib/catch-error.js");
const app = express();
const authRoutes = require("./routes/authRoutes.js")
const postRoutes = require("./routes/postRoutes.js")
const commentRoutes = require("./routes/commentRoutes.js")
const errorHandlingRoutes = require("./routes/errorHandlingRoutes.js")
const host = config.HOST;
const port = config.PORT;
const LokiStore = store(session);
const requiresAuthentication  = require("./lib/requiresAuthentication.js");
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
  res.locals.signedIn = req.session.signedIn; 
  res.locals.username = req.session.username;
  res.locals.userId = req.session.userId;
  delete req.session.flash;
  next();
});

// redirect user to the first page of the forums
app.get("/", (req, res) => {
  res.redirect("/forum?page=1")
});

//this is the home page.
app.get("/forum", 
  requiresAuthentication, 
  catchError(async (req, res) => {
    let pageNumber = parseInt(req.query.page);

    if (isNaN(pageNumber) || pageNumber < 1) throw new Error('Invalid Page Number');

    let maxPageNumber = await res.locals.store.getMaxPosts(POSTS_PER_PAGE);
    let posts;

    if (maxPageNumber === 0 && pageNumber > 1) {
      throw new Error("Invalid Page Number");
    } else {
      if (maxPageNumber == 0) {
        posts = [];
      } else if (pageNumber > maxPageNumber) {
        throw new Error("Invalid Page Number");
      } else {
        posts = await res.locals.store.getPostsForPage(pageNumber, POSTS_PER_PAGE);
      }
    }

    res.render('forum-posts', {
      posts,
      pageNumber,
      maxPageNumber
    });
  })
);
postRoutes(app, catchError);

commentRoutes(app, catchError);

authRoutes(app, catchError);

errorHandlingRoutes(app);

app.listen(port, host, () => {
  console.log(`Project is listening on port ${port} !`);
});