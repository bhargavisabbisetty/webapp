const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const mysql = require('mysql');
const basicAuth = require('./helpers/basic_authentication');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'bhargavI123',
  database : 'csye6225'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

app.get('/',(req,res) => {
    res.send('CSYE 6225 Assignment 2');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(basicAuth);

let initApp = require('./app');
initApp(app);

app.listen(port, () => console.log(`Started listening on port ${port}...`))

module.exports['connection'] = connection