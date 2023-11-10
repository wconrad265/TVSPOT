const requiresAuthentication = (req, res, next) => {
  if (!res.locals.signedIn) {
    console.log("UNauthorized");
    req.session.redirectTo = req.originalUrl;
    res.redirect(302, "/users/signin");
  } else {
    next();
  }
};

module.exports = requiresAuthentication;
