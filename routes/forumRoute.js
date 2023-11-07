const requiresAuthentication = require("../lib/requiresAuthentication.js");
const catchError = require("../lib/catch-error.js");
const POSTS_PER_Pagination = 5; //edit to change the number of posts per a

module.exports = (app) => {
  // redirect user to the first page of the forums
  app.get("/", (req, res) => {
    res.redirect("/forum?page=1");
  });

  //this is the home page.
  app.get(
    "/forum",
    requiresAuthentication,
    catchError(async (req, res) => {
      const pageNumber = parseInt(req.query.page);
      const store = res.locals.store;

      if (isNaN(pageNumber) || pageNumber < 1)
        throw new Error("Invalid Page Number");

      const maxPageNumber = await store.getMaxPosts(POSTS_PER_Pagination);
      if (!maxPageNumber) throw new Error("Could not get MaxPageNumber");
      let posts = [];

      if (
        (maxPageNumber === 0 && pageNumber > 1) ||
        (maxPageNumber !== 0 && pageNumber > maxPageNumber)
      ) {
        throw new Error("Invalid Page Number");
      } else if (maxPageNumber !== 0) {
        posts = await store.getPostsForPage(pageNumber, POSTS_PER_Pagination);
        if (!posts) throw new Error("Posts not found");
      }
      console.log(posts);
      res.render("forum-posts", {
        posts,
        pageNumber,
        maxPageNumber,
      });
    }),
  );
};
