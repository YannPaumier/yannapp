module.exports = (app) => {
  /* GET home page. */
  app.get('/', function (req, res, next) {
    console.log('New connection ');
    res.render('index.ejs', { pseudo: 'noname' });
  });

};
