const { body, validationResult } = require("express-validator");
const requiresAuthentication = require("../lib/requiresAuthentication.js");
const { checkEditPostPermissions } = require("../lib/edit-permissions.js");
const Comments_PER_PAGE = 5; //edit to change the number of posts per a
const catchError = require("../lib/catch-error.js");

module.exports = (app) => {
  //View the Add new Forum Post Page
  app.get(
    "/posts/new",
    requiresAuthentication,
    catchError(async (req, res) => {
      res.render("new-post");
    }),
  );

  //Render post management page
  app.get(
    "/posts/manage",
    requiresAuthentication,
    catchError(async (req, res) => {
      const userPosts = await res.locals.store.getUserPosts();

      if (!userPosts) throw new Error("User Posts not found");

      res.render("post-management", { userPosts });
    }),
  );

  // Create a new forum post
  app.post(
    "/posts/new",
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
        .withMessage("Forum title must be between 1 and 100 characters"),
    ],
    catchError(async (req, res) => {
      const errors = validationResult(req);
      let postTitle = req.body.postTitle;
      let comment = req.body.comment;

      const renderNewForumPost = async (postTitle, comment) => {
        res.render("new-post", {
          flash: req.flash(),
          postTitle: postTitle || "",
          comment: comment || "",
        });
      };

      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash("error", error.msg);
          if (error.param === "postTitle") postTitle = null;
          if (error.param === "comment") comment === null;
        });
        return renderNewForumPost(postTitle, comment);
      }

      if (await res.locals.store.existsForumPostTitle(postTitle)) {
        req.flash("error", "Forum Post title must be unique");
        return renderNewForumPost(null, comment);
      }

      const createdPost = await res.locals.store.createPost(postTitle);

      if (!createdPost) {
        req.flash("error", "Forum Post title must be unique");
        return renderNewForumPost(null, comment);
      }

      const createdComment = await res.locals.store.createComment(
        createdPost,
        comment,
      );
      if (!createdComment) throw new Error("Comment not Created");

      req.flash("success", "Your forum post has been created!");
      res.redirect("/forum?page=1"); // Redirect to the first page of the forum
    }),
  );

  //Render Edit Post Page
  app.get(
    "/posts/:postId/edit",
    requiresAuthentication,
    checkEditPostPermissions,
    catchError(async (req, res) => {
      const postId = req.params.postId;
      const title = await res.locals.store.getPostTitle(+postId);

      res.render("edit-post-title", {
        postId,
        title: `Edit Title for '${title}'`,
        postTitle: title,
      });
    }),
  );

  //Edit Post Title
  app.post(
    "/posts/:postId/edit",
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
      const postTitle = req.body.postTitle;
      const postId = req.params.postId;

      const renderEditForumPost = async () => {
        const title = await res.locals.store.getPostTitle(postId);

        res.render("edit-post-title", {
          flash: req.flash(),
          title: `Edit Title for '${title}'`,
          postId,
        });
      };

      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          errors.array().forEach((message) => req.flash("error", message.msg));
          return renderEditForumPost();
        }

        if (await res.locals.store.existsForumPostTitle(postTitle)) {
          req.flash("error", "Forum Post title must be unique");
          return renderEditForumPost();
        }

        const editedPost = await res.locals.store.editPostTitle(
          postTitle,
          postId,
        );
        if (!editedPost) {
          req.flash("error", "Forum Post title must be unique");
          return renderEditForumPost();
        }

        req.flash("success", "Your forum title has been edited!");
        res.redirect("/posts/manage");
      } catch (error) {
        if (res.locals.store.isUniqueConstraintViolation(error)) {
          req.flash("error", "Forum Post title must be unique");
          return renderEditForumPost();
        } else {
          throw error;
        }
      }
    }),
  );

  //Delete Post
  app.post(
    "/posts/:postId/delete/",
    requiresAuthentication,
    checkEditPostPermissions,
    catchError(async (req, res) => {
      const postId = req.params.postId;

      const deleted = await res.locals.store.deletePost(postId);

      if (!deleted) {
        throw new Error("Post not Deleted");
      } else {
        req.flash("success", "Your post has been deleted!");
        res.redirect("/posts/manage");
      }
    }),
  );

  //View the comments of a forum Post
  app.get(
    "/posts/:postId",
    requiresAuthentication,
    catchError(async (req, res) => {
      const pageNumber = parseInt(req.query.page);
      const postId = req.params.postId;

      if (isNaN(pageNumber) || pageNumber < 1)
        throw new Error("Invalid Page Number");

      const maxPageNumber = await res.locals.store.getMaxComments(
        postId,
        Comments_PER_PAGE,
      );
      let comments = [];

      if (
        (maxPageNumber === 0 && pageNumber > 1) ||
        (maxPageNumber !== 0 && pageNumber > maxPageNumber)
      ) {
        throw new Error("Invalid Page Number");
      } else if (maxPageNumber !== 0) {
        comments = await res.locals.store.getCommentsForPage(
          +postId,
          pageNumber,
          Comments_PER_PAGE,
        );
        if (!comments) throw new Error("Comments not found for post");
      }

      const postTitle = await res.locals.store.getPostTitle(+postId);
      if (!postTitle) throw new Error("Post Title not found");

      res.render("post-comments", {
        comments,
        pageNumber,
        maxPageNumber,
        postTitle,
        postId,
        currentUserId: res.locals.userId,
      });
    }),
  );
};
