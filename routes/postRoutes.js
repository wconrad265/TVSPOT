const { body, validationResult } = require("express-validator");
const requiresAuthentication  = require("../lib/requiresAuthentication.js");
const { checkEditPostPermissions } = require("../lib/edit-permissions.js");
const POSTS_PER_PAGE = 5; //edit to change the number of posts per a


module.exports = (app, catchError) => {
  //View the Add new Forum Post Page
  app.get("/posts/new",
  requiresAuthentication,
  catchError(async (req, res) => {
    res.render('new-post');
  })
  );

  //Render post management page
  app.get("/posts/manage", 
  requiresAuthentication,
  catchError(async (req, res) => {

    let userPosts = await res.locals.store.getUserPosts();

    if (!userPosts) throw new Error("User Posts not found");

    res.render("post-management", { userPosts });
  })
  );

  // Create a new forum post
  app.post("/posts/new", 
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

  //Render Edit Post Page
  app.get("/posts/:postId/edit", 
  requiresAuthentication,
  checkEditPostPermissions,
  catchError(async (req, res) => {
    let postId = req.params.postId;
    let title = await res.locals.store.getPostTitle(+postId);

    res.render("edit-post-title", {
      postId,
      title: `Edit Title for '${title}'`,
      postTitle: title
    })
  })
  );

  //Edit Post Title 
  app.post("/posts/:postId/edit",
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
      res.redirect('/posts/manage'); // Redirect to the first page of the forum

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
  app.post("/posts/:postId/delete/",
  requiresAuthentication,
  checkEditPostPermissions,
  catchError(async (req, res) => {
    let postId = req.params.postId;

    let deleted = await res.locals.store.deletePost(postId);

    if (!deleted) {
      throw new Error ('Post not Deleted');
    } else {
      req.flash("success", 'Your post has been deleted!');
      res.redirect("/posts/manage");
    }

  })
  );

  //View the comments of a forum Post
  app.get("/posts/:postId", 
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

      res.render('post-comments', {
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
}