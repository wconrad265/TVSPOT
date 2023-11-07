// Error handler
module.exports = (app) => {
  app.use((err, req, res, _next) => {
    console.log(err); // Writes more extensive information to the console log
    const errorMessage = "The page you're looking for doesn't exist.";
    res.status(404).render('error', { errorMessage });
  });
  
  app.use((req, res) => {
    const errorMessage = "The page you're looking for doesn't exist.";
    res.status(404).render('error', { errorMessage }); 
  });
}
