const catchError = require("../lib/catch-error.js");

module.exports = (app) => {
  //render sign in page
  app.get("/users/signin", (req, res) => {
    res.render("signin");
  });

  //user sign in
  app.post(
    "/users/signin",
    catchError(async (req, res) => {
      const username = req.body.username.trim();
      const password = req.body.password;
      const store = res.locals.store;

      const authenticated = await store.authenticate(username, password);

      if (!authenticated) {
        req.flash("error", "Invalid credentials.");
        res.render("signin", {
          flash: req.flash(),
          username: username,
        });
      } else {
        req.session.username = username;
        req.session.signedIn = true;
        req.session.userId = await store.getUserId(username);

        const redirectTo = req.session.redirectTo || "/forum?page=1"; // redirect to page user was on
        delete req.session.redirectTo;
        console.log(redirectTo, "login was successful", authenticated);
        console.log(req.session);
        req.flash("info", "Welcome!");
        res.redirect(redirectTo);
      }
    }),
  );

  //User sign out
  app.post("/users/signout", (req, res) => {
    delete req.session.username;
    delete req.session.signedIn;
    delete req.session.userId;
    res.redirect("/users/signin");
  });
};
