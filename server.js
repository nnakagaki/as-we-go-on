const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express()
const port = process.env.PORT || 3000;
const mysql = require('mysql');
const dbConfig = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

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