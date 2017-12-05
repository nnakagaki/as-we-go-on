const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    googleClientId : process.env.GOOGLE_CLIENT_ID || 'wontwork'
  });
});

app.listen(port, () => console.log('Example app listening on port 3000!'))