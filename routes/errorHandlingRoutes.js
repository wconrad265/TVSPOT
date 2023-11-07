// Error handler
module.exports = (app) => {
  app.use((err, req, res, _next) => {
    console.log(err); // Writes more extensive information to the console log
    let errorMessage = "The page you're looking for doesn't exist.";
    res.status(404).render('error', { errorMessage });
  });
  
  app.use((req, res) => {
    let errorMessage = "The page you're looking for doesn't exist.";
    res.status(404).render('error', { errorMessage }); // Render your 404 error page (404.pug)
  });
}
