const express = require('express');
var bodyParser = require('body-parser')
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


const app = express();

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

app.listen(3000, () => console.log('Example applistening on port 3000!!!'));


app.use(cookieParser());
app.use(express.static('client'));

app.use(session({
    secret: 'jibirish',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.use


app.get('/getUser', (req, res) => {
    let sql = 'SELECT * FROM user';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);

    });
});


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

