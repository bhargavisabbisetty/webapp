const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const mysql = require('mysql');
const basicAuth = require('./helpers/basic_authentication');
require('dotenv').config();

console.log(process.env.MYSQL_USER)
console.log(process.env.MYSQL_PASSWORD)
console.log(process.env.MYSQL_HOST)
console.log(process.env.MYSQL_DATABASE)

if (process.env.NODE_ENV === 'production') {
  console.log("ENV Production: " + process.env.NODE_ENV);
  var connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'rootpw',
      database: 'test_db'
  });
}
else{
var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
}
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
module.exports = app;