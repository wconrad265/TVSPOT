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
      res.render("new-comment", {
        postId,
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

      if (!errors.isEmpty()) {
        errors.array().forEach((message) => req.flash("error", message.msg));

        return res.render("new-comment", {
          flash: req.flash(),
          postId,
        });
      }

      const created = await res.locals.store.createComment(+postId, comment);
      if (!created) throw new Error("Comment could not be created");

      req.flash("success", "Your comment has been created!");
      res.redirect(`/posts/${postId}?page=1`);
    }),
  );

  //Render Edit-comment Page
  app.get(
    "/posts/:postId/comment/:commentId/edit",
    requiresAuthentication,
    checkEditCommentPermissions,
    catchError(async (req, res) => {
      const { postId, commentId } = req.params;

      const comment = await res.locals.store.getComment(+commentId);
      if (!comment) throw new Error("comment does not exist");

      res.render("edit-comment", {
        postId,
        commentId,
        comment,
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
        .isLength({ max: 1000 })
        .withMessage("Comments must be between 1 and 1000 characters"),
    ],
    catchError(async (req, res) => {
      const errors = validationResult(req);
      const { postId, commentId } = req.params;
      const comment = req.body.comment;

      if (!errors.isEmpty()) {
        errors.array().forEach((message) => req.flash("error", message.msg));
        return res.render("edit-comment", {
          flash: req.flash(),
          postId,
          commentId,
        });
      }

      const updatedComment = res.locals.store.updateComment(
        comment,
        +commentId,
      );
      if (!updatedComment)
        throw new Error("Something went wrong Comment not Updated");

      req.flash("success", "Your comment has been updated!");
      res.redirect(`/posts/${postId}/?page=1`);
    }),
  );

  //delete a comment
  app.post(
    "/posts/:postId/comment/:commentId/delete",
    requiresAuthentication,
    checkEditCommentPermissions,
    catchError(async (req, res) => {
      const { postId, commentId } = req.params;

      const deleted = await res.locals.store.deleteComment(postId, commentId);
      if (!deleted) throw new Error("Comment not Deleted");

      req.flash("success", "Your comment has been deleted!");
      res.redirect(`/posts/${postId}/?page=1`);
    }),
  );
};
