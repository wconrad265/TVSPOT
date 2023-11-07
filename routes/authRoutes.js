const catchError = require("../lib/catch-error.js");

module.exports = (app) => {
  //render sign in page
  app.get("/users/signin", (req, res) => {
    res.render("signin");
  })

  //user sign in
  app.post("/users/signin", 
    catchError(async (req, res) => {
    let username = req.body.username.trim();
    let password = req.body.password;

    let authenticated = await res.locals.store.authenticate(username, password);

    if (!authenticated) {
      req.flash("error", "Invalid credentials.");
      res.render("signin", {
        flash: req.flash(),
        username: username
      });
    } else {
      req.session.username = username;
      req.session.signedIn = true;
      req.session.userId = await res.locals.store.getUserId(username);
      req.flash("info", "Welcome!");
      res.redirect("/forum?page=1");
    }
    })
  );

  //User sign out
  app.post("/users/signout", (req, res) => {
    delete req.session.username;
    delete req.session.signedIn;
    delete req.session.userId;
    res.redirect("/users/signin");
  });
}

