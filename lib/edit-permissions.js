const catchError = require("./catch-error.js");

const checkEditPostPermissions = catchError(async (req, res, next) => {
  let resourceUserId = await res.locals.store.getPostUserId(+req.params.postId);
  let userId = res.locals.userId;
 
  if (!resourceUserId) throw new Error('Error getting UserId');

  if (resourceUserId !== userId) {
    console.log("UNauthorized edit Post Page");
    let errorMessage = "You don't have permission to access this page.";
    res.status(401).render('error', { errorMessage }); // Render your error page
  } else {
    next();
  }
});

const checkEditCommentPermissions = catchError(async (req, res, next) => {
  let resourceUserId = await res.locals.store.getCommentUserId(+req.params.commentId);
  let userId = res.locals.userId;

  if (!resourceUserId) throw new Error('Error getting UserId');
  if (resourceUserId !== userId) {
    console.log("UNauthorized edit Comment Page");
    let errorMessage = "You don't have permission to access this page.";
    res.status(401).render('error', { errorMessage }); // Render your error page
  } else {
    next();
  }
});

module.exports = { checkEditPostPermissions, checkEditCommentPermissions };