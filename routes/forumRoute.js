const requiresAuthentication  = require("../lib/requiresAuthentication.js");
const catchError = require("../lib/catch-error.js");
const POSTS_PER_PAGE = 5; //edit to change the number of posts per a

module.exports = (app) => {
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
};