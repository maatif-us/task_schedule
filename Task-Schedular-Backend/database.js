const mysql = require('mysql');

module.exports = mysql.createConnection({
          host : 'localhost',
          port: '3306',
          user:'root',
          password : 'admin12345',
          database:'schedular'
});