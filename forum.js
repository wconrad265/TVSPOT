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
const requiresAuthentication  = require("./lib/requiresAuthentication.js");
const { checkEditPostPermissions, checkEditCommentPermissions } = require("./lib/edit-permissions.js");
const authRoutes = require("./routes/authRoutes.js")
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

//View the new post to the forum
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
    body("comment")
      .trim()
      .isLength({ min: 1 })
      .withMessage("A comment for the forum post is required.")
      .isLength({ max: 500 })
      .withMessage("Forum title must be between 1 and 5000 characters"),
  ],
  catchError(async (req, res) => {
    let errors = validationResult(req);
    let postTitle = req.body.postTitle;
    let comment = req.body.comment;

    const renderNewForumPost = async(postTitle, comment) => {
      res.render('new-post', {
        flash: req.flash(),
        postTitle: postTitle || '',
        comment: comment || ''
      });
    };

    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      renderNewForumPost();

    } else if (await res.locals.store.existsForumPostTitle(postTitle)) {
      req.flash("error", "Forum Post title must be unique");
      renderNewForumPost(postTitle, comment);
    } else {
      let createdPost = await res.locals.store.createPost(postTitle);

      if (!createdPost) {
        req.flash("error", "Forum Post title must be unique");
        renderNewForumPost(undefined, comment);
      } else {
        let createdComment = await res.locals.store.createComment(createdPost, comment);
        if (!createdComment) throw new Error('Comment not Created');
  
        req.flash("success", 'Your forum post has been created!')
        res.redirect('/forum?page=1'); // Redirect to the first page of the forum
      }
    }
  })
);

//View the comments of a forum Post
app.get("/forum/post/:postId", 
  requiresAuthentication,
  catchError(async (req, res) => {
    let pageNumber = parseInt(req.query.page);
    let postId = req.params.postId;

    if (isNaN(pageNumber) || pageNumber < 1) throw new Error('Invalid Page Number');

    let maxPageNumber = await res.locals.store.getMaxComments(postId, POSTS_PER_PAGE);
    let comments;
    console.log('test', maxPageNumber );
    if (maxPageNumber === 0 && pageNumber > 1 && pageNumber > maxPageNumber) {
      throw new Error("Invalid Page Number");
    } else {
      if (maxPageNumber == 0) {
        comments = [];
      } else {
        comments = await res.locals.store.getCommentsForPage(+postId, pageNumber, POSTS_PER_PAGE);
        if (!comments) throw new Error('Comments not found for post');
      }
      let postTitle = await res.locals.store.getPostTitle(+postId);
      if(!postTitle) throw new Error('Post Title not found');

      res.render('comments', {
        comments,
        pageNumber,
        maxPageNumber,
        postTitle,
        postId,
        currentUserId: res.locals.userId
      }); 
    }
  })
);

//View the create comment(reply) page
app.get("/forum/post/:postId/reply", 
  requiresAuthentication,
  catchError(async (req, res) => {
    let postId = req.params.postId;
    res.render("new-comment", { postId });
  })
);

//Post a new comment
app.post("/forum/post/:postId/reply",
  requiresAuthentication,
  [
    body("comment")
      .trim()
      .isLength({ min: 1 })
      .withMessage("A comment cannot be empty.")
      .isLength({ max: 5000 })
      .withMessage("Comments must be between 1 and 5000 characters")
  ], 
  catchError(async (req, res) => {
    let errors = validationResult(req);
    let postId = req.params.postId;
    let comment = req.body.comment;
    console.log('hi)');
    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));

      res.render('new-comment', {
        flash: req.flash(),
        postId
      });
    } else {
      let created = await res.locals.store.createComment(+postId, comment);

      if (!created) {
        throw new Error('Comment could not be created');
      } else {
        req.flash("success", 'Your comment has been created!')
        res.redirect(`/forum/post/${postId}?page=1`); // Redirect to the first page of the forum
      }
    }
  })
);

//Render Edit-comment Page
app.get("/forum/post/:postId/edit-comment/:commentId",
  requiresAuthentication,
  checkEditCommentPermissions,
  catchError(async (req, res) => {
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    let pageNumber = req.query.page;
    console.log(pageNumber);

    let comment = await res.locals.store.getComment(+commentId);
    if (!comment) throw new Error ("comment does not exist");

    res.render("edit-comment", {
      postId,
      commentId,
      comment,
      pageNumber
    })
  })
);

//Edit a comment
app.post("/forum/post/:postId/edit-comment/:commentId",
  requiresAuthentication,
  checkEditCommentPermissions,
  [    
    body("comment")
    .trim()
    .isLength({ min: 1 })
    .withMessage("A comment cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Comments must be between 1 and 5000 characters")
  ],
  catchError(async (req, res) => {
    let errors = validationResult(req);
    let { postId, commentId } = req.params;
    let pageNumber = req.query.page;
    let comment = req.body.comment;

    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.render("edit-comment", {
        flash: req.flash(),
        postId,
        commentId,
        pageNumber
      })
    } else {
      let updatedComment = res.locals.store.updateComment(comment, +commentId);
      if (!updatedComment) throw new Error("Something went wrong Comment not Updated");
      
      req.flash("success", 'Your comment has been updated!');
      res.redirect(`/forum/post/${postId}/?page=${pageNumber}`);
    }
  })
);

//delete a comment
app.post("/forum/post/:postId/edit-comment/:commentId/destroy",
  requiresAuthentication,
  checkEditCommentPermissions,
  catchError(async (req, res) => {
    let { postId, commentId } = req.params;
    let pageNumber = req.query.page;

    let deleted = await res.locals.store.deleteComment(postId, commentId);
    if (!deleted) throw new Error("Comment not Deleted");

    req.flash("success", 'Your comment has been deleted!');
    res.redirect(`/forum/post/${postId}/?page=${pageNumber}`);
  }))


//Render post management page
app.get("/post-management", 
  requiresAuthentication,
  catchError(async (req, res) => {

    let userPosts = await res.locals.store.getUserPosts();

    if (!userPosts) throw new Error("User Posts not found");

    res.render("post-management", { userPosts });
  })
);

//Render Edit Post Page
app.get("/post-management/edit/:postId", 
  requiresAuthentication,
  checkEditPostPermissions,
  catchError(async (req, res) => {
    let postId = req.params.postId;
    let title = await res.locals.store.getPostTitle(+postId);

    res.render("edit-post-title", {
      postId,
      title: `Edit Title for '${title}'`,
    })
  })
);

//Edit Post Title 
app.post("/post-management/edit/:postId",
  requiresAuthentication,
  checkEditPostPermissions,
  [
    body("postTitle")
    .trim()
    .isLength({ min: 1 })
    .withMessage("A title for the forum post is required.")
    .isLength({ max: 100 })
    .withMessage("Forum title must be between 1 and 100 characters"),
  ],
  catchError(async (req, res) => {
    let postTitle = req.body.postTitle;
    let postId = req.params.postId;

    const renderEditForumPost = async() => {
      let title = await res.locals.store.getPostTitle(postId);

      res.render('edit-post-title', {
        flash: req.flash(),
        title: `Edit Title for '${title}'`,
        postId,
      });
    };

    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(message => req.flash("error", message.msg));
        renderEditForumPost();
      }

      if (await res.locals.store.existsForumPostTitle(postTitle)) {
        req.flash("error", "Forum Post title must be unique");
        renderEditForumPost();
      }

      let editedPost = await res.locals.store.editPostTitle(postTitle, postId);
      if (!editedPost) {
        req.flash("error", "Forum Post title must be unique");
        renderEditForumPost();
      }

      req.flash("success", 'Your forum title has been edited!')
      res.redirect('/post-management'); // Redirect to the first page of the forum

    } catch (error) {
      if (res.locals.store.isUniqueConstraintViolation(error)) {
        req.flash("error", "Forum Post title must be unique");
        renderEditForumPost();
      } else {
        throw error;
      }
    }
  })
); 

//Delete Post 
app.post("/post-management/delete/:postId",
  requiresAuthentication,
  checkEditPostPermissions,
  catchError(async (req, res) => {
    let postId = req.params.postId;

    let deleted = await res.locals.store.deletePost(postId);

    if (!deleted) {
      throw new Error ('Post not Deleted');
    } else {
      req.flash("success", 'Your post has been deleted!');
      res.redirect("/post-management");
    }

  })
);
authRoutes(app, catchError);


// Error handler
app.use((err, req, res, _next) => {
  console.log(err); // Writes more extensive information to the console log
  let errorMessage = "The page you're looking for doesn't exist.";
  res.status(404).render('error', { errorMessage });
});

app.use((req, res) => {
  let errorMessage = "The page you're looking for doesn't exist.";
  res.status(404).render('error', { errorMessage }); // Render your 404 error page (404.pug)
});

app.listen(port, host, () => {
  console.log(`Project is listening on port ${port} !`);
});