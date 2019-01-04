var mysql = require('mysql');


//sql create connection
var db = mysql.createConnection({
    //properties
    host: 'localhost',
    port: 3310,
    user: 'root',
    password: '',
    database: 'thales2018',
    socketPath: "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock"
});

db.connect(function (err) {
    if (err) {
        console.log('error');
    } else {
        console.log('Connected')
    }
});


module.exports = db;
