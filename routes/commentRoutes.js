const requiresAuthentication = require("../lib/requiresAuthentication.js");
const { checkEditCommentPermissions } = require("../lib/edit-permissions.js");
const { body, validationResult } = require("express-validator");
const catchError = require("../lib/catch-error.js");

module.exports = (app) => {
  //View the create comment(reply) page
  app.get(
    "/posts/:postId/comment/new",
    requiresAuthentication,
    catchError(async (req, res) => {
      const postId = req.params.postId;
      const pageNumber = parseInt(req.query.page);
      res.render("new-comment", {
        postId,
        pageNumber,
      });
    }),
  );

  //Post a new comment
  app.post(
    "/posts/:postId/comment/new",
    requiresAuthentication,
    [
      body("comment")
        .trim()
        .isLength({ min: 1 })
        .withMessage("A comment cannot be empty.")
        .isLength({ max: 1000 })
        .withMessage("Comments must contain between 1 and 1000 characters"),
    ],
    catchError(async (req, res) => {
      const errors = validationResult(req);
      const postId = req.params.postId;
      const comment = req.body.comment;
      const pageNumber = parseInt(req.query.page);

      if (!errors.isEmpty()) {
        errors.array().forEach((message) => req.flash("error", message.msg));

        return res.render("new-comment", {
          flash: req.flash(),
          postId,
          pageNumber,
        });
      }

      const created = await res.locals.store.createComment(+postId, comment);
      if (!created) throw new Error("Comment could not be created");

      req.flash("success", "Your comment has been created!");
      res.redirect(`/posts/${postId}?page=${pageNumber}`);
    }),
  );

  //Render Edit-comment Page
  app.get(
    "/posts/:postId/comment/:commentId/edit",
    requiresAuthentication,
    checkEditCommentPermissions,
    catchError(async (req, res) => {
      const { postId, commentId } = req.params;
      const pageNumber = parseInt(req.query.page);

      const comment = await res.locals.store.getComment(+commentId);
      if (!comment) throw new Error("comment does not exist");

      res.render("edit-comment", {
        postId,
        commentId,
        comment,
        pageNumber,
      });
    }),
  );

  //Edit a comment
  app.post(
    "/posts/:postId/comment/:commentId/edit",
    requiresAuthentication,
    checkEditCommentPermissions,
    [
      body("comment")
        .trim()
        .isLength({ min: 1 })
        .withMessage("A comment cannot be empty")
        .isLength({ max: 500 })
        .withMessage("Comments must be between 1 and 5000 characters"),
    ],
    catchError(async (req, res) => {
      const errors = validationResult(req);
      const { postId, commentId } = req.params;
      const pageNumber = parseInt(req.query.page);
      const comment = req.body.comment;

      if (!errors.isEmpty()) {
        errors.array().forEach((message) => req.flash("error", message.msg));
        return res.render("edit-comment", {
          flash: req.flash(),
          postId,
          commentId,
          pageNumber,
        });
      }

      const updatedComment = res.locals.store.updateComment(
        comment,
        +commentId,
      );
      if (!updatedComment)
        throw new Error("Something went wrong Comment not Updated");

      req.flash("success", "Your comment has been updated!");
      res.redirect(`/posts/${postId}/?page=${pageNumber}`);
    }),
  );

  //delete a comment
  app.post(
    "/posts/:postId/comment/:commentId/delete",
    requiresAuthentication,
    checkEditCommentPermissions,
    catchError(async (req, res) => {
      const { postId, commentId } = req.params;
      const pageNumber = req.query.page;

      const deleted = await res.locals.store.deleteComment(postId, commentId);
      if (!deleted) throw new Error("Comment not Deleted");

      req.flash("success", "Your comment has been deleted!");
      res.redirect(`/posts/${postId}/?page=${pageNumber}`);
    }),
  );
};
