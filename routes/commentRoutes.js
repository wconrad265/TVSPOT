const requiresAuthentication  = require("../lib/requiresAuthentication.js");
const { checkEditCommentPermissions } = require("../lib/edit-permissions.js");
const { body, validationResult } = require("express-validator");

module.exports = (app, catchError) => {
  //View the create comment(reply) page
  app.get("/posts/:postId/comment/new", 
    requiresAuthentication,
    catchError(async (req, res) => {
      let postId = req.params.postId;
      let pageNumber = parseInt(req.query.page);
      res.render("new-comment", { 
        postId,
        pageNumber
       });
    })
  );

  //Post a new comment
  app.post("/posts/:postId/comment/new",
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
      let pageNumber = parseInt(req.query.page);

      if (!errors.isEmpty()) {
        errors.array().forEach(message => req.flash("error", message.msg));

        res.render('new-comment', {
          flash: req.flash(),
          postId,
          pageNumber
        });
      } else {
        let created = await res.locals.store.createComment(+postId, comment);

        if (!created) {
          throw new Error('Comment could not be created');
        } else {
          req.flash("success", 'Your comment has been created!')
          res.redirect(`/posts/${postId}?page=${pageNumber}`); // Redirect to the first page of the forum
        }
      }
    })
  );

  //Render Edit-comment Page
  app.get("/posts/:postId/comment/:commentId/edit",
    requiresAuthentication,
    checkEditCommentPermissions,
    catchError(async (req, res) => {
      let { postId, commentId } = req.params;
      let pageNumber = parseInt(req.query.page);

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
  app.post("/posts/:postId/comment/:commentId/edit",
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
      let pageNumber = parseInt(req.query.page);
      let comment = req.body.comment;
      console.log(commentId);

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
        res.redirect(`/posts/${postId}/?page=${pageNumber}`);
      }
    })
  );

  //delete a comment
  app.post("/posts/:postId/comment/:commentId/delete",
    requiresAuthentication,
    checkEditCommentPermissions,
    catchError(async (req, res) => {
      let { postId, commentId } = req.params;
      let pageNumber = req.query.page;

      let deleted = await res.locals.store.deleteComment(postId, commentId);
      if (!deleted) throw new Error("Comment not Deleted");

      req.flash("success", 'Your comment has been deleted!');
      res.redirect(`/posts/${postId}/?page=${pageNumber}`);
    }))
}
