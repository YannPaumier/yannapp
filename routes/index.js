module.exports = (app) => {
  /* GET home page. */
  app.get('/', function (req, res, next) {
    if (process.env.PORT) {
      url = 'https://yannapp.herokuapp.com/';
    } else {
      url = 'http://localhost:3000';
    }

    console.log('New connection ');
    res.render('index.ejs', { url });
  });

};
