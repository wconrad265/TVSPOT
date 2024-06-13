const config = require("./lib/config.js");
const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis").default;
const PgPersistence = require("./lib/pg-persistence.js");
const app = express();
const forumRoute = require("./routes/forumRoute.js");
const authRoutes = require("./routes/authRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const commentRoutes = require("./routes/commentRoutes.js");
const errorHandlingRoutes = require("./routes/errorHandlingRoutes.js");
const port = config.PORT;

const redisClient = redis.createClient({
  url: config.REDIS_URL, // Ensure you have a REDIS_URL in your config
});

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch(console.error);

const redisStore = new RedisStore({ client: redisClient, prefix: "TV-Spot" });
app.set("trust proxy", true);

app.set("views", "./views");
app.set("view engine", "pug");
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    cookie: {
      httpOnly: true,
      maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
      path: "/",
      secure: true,
    },
    name: "TV-Spot",
    resave: false,
    saveUninitialized: true,
    secret: config.SECRET,
    store: redisStore,
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
});

//extract session info
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  res.locals.signedIn = req.session.signedIn;
  res.locals.username = req.session.username;
  res.locals.userId = req.session.userId;
  delete req.session.flash;
  next();
});

forumRoute(app);

postRoutes(app);

commentRoutes(app);

authRoutes(app);

errorHandlingRoutes(app);

app.listen(port, () => {
  console.log(`Project is listening on port ${port} !`);
});
