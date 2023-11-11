const { body, validationResult } = require("express-validator");
const requiresAuthentication = require("../lib/requiresAuthentication.js");
const { checkEditPostPermissions } = require("../lib/edit-permissions.js");
const catchError = require("../lib/catch-error.js");
const COMMENTS_PER_PAGINATION = 5; //edit to change the number of posts per a page
const POSTS_PER_Pagination = 5; //edit to change the number of posts per a page

module.exports = (app) => {
  //Render post management page
  app.get(
    "/posts/manage",
    requiresAuthentication,
    catchError(async (req, res) => {
      const pageNumber = parseInt(req.query.page);
      const store = res.locals.store;

      if (isNaN(pageNumber) || pageNumber < 1) {
        throw new Error("Invalid Page Number");
      }

      const maxPageNumber = await store.getMaxUserPosts(POSTS_PER_Pagination);
      if (!maxPageNumber) throw new Error("maxPageNumber Error");

      if (pageNumber > maxPageNumber) {
        throw new Error("Page does not exist");
      }

      const userPosts = await store.getUserPostsForPage(
        pageNumber,
        POSTS_PER_Pagination,
      );
      if (!userPosts) throw new Error("Posts not found");

      res.render("post-management", {
        userPosts,
        pageNumber,
        maxPageNumber,
      });
    }),
  );

  //View the Add new Forum Post Page
  app.get(
    "/posts/new",
    requiresAuthentication,
    catchError(async (req, res) => {
      res.render("new-post");
    }),
  );

  // Create a new forum post
  app.post(
    "/posts/new",
    requiresAuthentication,
    [
      body("forumPostTitle")
        .trim()
        .isLength({ min: 1 })
        .withMessage("The forum post title cannot be empty.")
        .isLength({ max: 100 })
        .withMessage(
          "The forum post title must contain between 1 and 100 characters",
        ),
      body("forumPostComment")
        .trim()
        .isLength({ min: 1 })
        .withMessage("The forum post comment cannot be empty.")
        .isLength({ max: 1000 })
        .withMessage(
          "The forum post comment must contain between 1 and 1000 characters.",
        ),
    ],
    catchError(async (req, res) => {
      const errors = validationResult(req);
      const store = res.locals.store;
      let forumPostTitle = req.body.forumPostTitle;
      let forumPostComment = req.body.forumPostComment;

      const renderNewForumPost = async (forumPostTitle, forumPostComment) => {
        res.render("new-post", {
          flash: req.flash(),
          forumPostTitle: forumPostTitle || "",
          forumPostComment: forumPostComment || "",
        });
      };

      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash("error", error.msg);
          if (error.path === "forumPostTitle") forumPostTitle = null;
          if (error.path === "forumPostComment") forumPostComment = null;
        });
        return renderNewForumPost(forumPostTitle, forumPostComment);
      }

      if (await store.existsForumPostTitle(forumPostTitle)) {
        req.flash("error", "Forum Post title must be unique");
        return renderNewForumPost(null, forumPostComment);
      }

      const createdPost = await store.createPost(forumPostTitle);

      if (!createdPost) {
        req.flash("error", "Forum Post title must be unique");
        return renderNewForumPost(null, forumPostComment);
      }

      const createdComment = await store.createComment(
        createdPost,
        forumPostComment,
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
      const forumPostTitle = await res.locals.store.getPostTitle(+postId);

      res.render("edit-post-title", {
        postId,
        title: `Edit Title for '${forumPostTitle}'`,
        forumPostTitle,
      });
    }),
  );

  //Edit Post Title
  app.post(
    "/posts/:postId/edit",
    requiresAuthentication,
    checkEditPostPermissions,
    [
      body("forumPostTitle")
        .trim()
        .isLength({ min: 1 })
        .withMessage("The forum post title cannot be empty.")
        .isLength({ max: 100 })
        .withMessage(
          "The forum post comment must contain between 1 and 1000 characters.",
        ),
    ],
    catchError(async (req, res) => {
      const store = res.locals.store;
      const forumPostTitle = req.body.forumPostTitle;
      const postId = req.params.postId;

      const renderEditForumPost = async () => {
        const originalForumPostTitle = await store.getPostTitle(postId);

        res.render("edit-post-title", {
          flash: req.flash(),
          title: `Edit Title for '${originalForumPostTitle}'`,
          postId,
        });
      };

      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          errors.array().forEach((message) => req.flash("error", message.msg));
          return renderEditForumPost();
        }

        if (await store.existsForumPostTitle(forumPostTitle)) {
          req.flash("error", "Forum Post title must be unique");
          return renderEditForumPost();
        }

        const editedPost = await store.editPostTitle(forumPostTitle, postId);
        if (!editedPost) {
          req.flash("error", "Forum Post title must be unique");
          return renderEditForumPost();
        }

        req.flash("success", "Your forum title has been edited!");
        res.redirect(`/posts/manage?page=1`);
      } catch (error) {
        if (store.isUniqueConstraintViolation(error)) {
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
        res.redirect(`/posts/manage?page=1`);
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
      const store = res.locals.store;

      if (isNaN(pageNumber) || pageNumber < 1)
        throw new Error("Invalid Page Number");

      const maxPageNumber = await store.getMaxComments(
        postId,
        COMMENTS_PER_PAGINATION,
      );
      let forumPostComments = [];

      if (
        (maxPageNumber === 0 && pageNumber > 1) ||
        (maxPageNumber !== 0 && pageNumber > maxPageNumber)
      ) {
        throw new Error("Invalid Page Number");
      } else if (maxPageNumber !== 0) {
        forumPostComments = await store.getCommentsForPage(
          postId,
          pageNumber,
          COMMENTS_PER_PAGINATION,
        );
        if (!forumPostComments) throw new Error("Comments not found for post");
      }

      const forumPostTitle = await store.getPostTitle(+postId);
      if (!forumPostTitle) throw new Error("Post Title not found");
      console.log(forumPostComments);
      res.render("post-comments", {
        forumPostComments,
        pageNumber,
        maxPageNumber,
        forumPostTitle,
        postId,
        currentUserId: res.locals.userId,
      });
    }),
  );
};
