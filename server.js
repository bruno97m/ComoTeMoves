const express = require('express');
var bodyParser = require('body-parser')
const mysql = require('mysql');

const app = express();


var db = mysql.createConnection({
    //properties
    host: 'localhost',
    port:3310,
    user: 'root',
    password: '',
    database: 'thales2018',
    socketPath:"/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock"
});

db.connect(function (err) {
    if (err) {
        console.log('error');
    } else {
        console.log('Connected')
    }
});

app.use(express.static('client'));

app.get('/test', function (req, res) {
    //about my sql
    db.query("SELECT * FROM user", function (error, rows, fields) {
        if (error) {
            console.log('error in the query');
        } else {
            console.log('Successful query');
            res.send(rows[0].Nome);
        }
    });
})


app.listen(3000, () => console.log('Example applistening on port 3000!!!'));
