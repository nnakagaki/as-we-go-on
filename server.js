const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express()
const port = process.env.PORT || 3000;
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
});

connection.connect(function(err) {
  console.log(err);
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    googleClientId : process.env.GOOGLE_CLIENT_ID || 'wontwork'
  });
});

app.get('/strokes', (req, res) => {
  var results;

  connection.query('SELECT * FROM strokes', function (error, results, fields) {
    if (error) {
      console.log(error);
      return;
    }
    results = results;
    res.json(results)
  });
});

app.post('/strokes', (req, res) => {
  console.log(req.body)
  var stroke = req.body.stroke

  connection.query('INSERT INTO strokes SET ?', { stroke : stroke.stroke, page : stroke.page}, function (error, results, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log(results.insertId);
    }
  });
});

app.listen(port, () => console.log('Example app listening on port 3000!'))