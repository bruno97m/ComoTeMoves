var express = require('express');
var bodyParser = require('body-parser')
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var http = require('http')
var app = express();
var bcrypt = require('bcrypt');
const saltRounds = 10;
var router = express.Router();
var path = require('path');
var db = require('./db');

//sendFile(__dirname+'/public..)


app.listen(3000, function () {
    console.log('Example app listening on port 3000!!!');
});


app.use(cookieParser());
app.use(express.static('client'));
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
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


app.get('/getUser', function (req, res) {
    let query = 'SELECT * FROM user';
    db.query(query, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);

    });
});


app.get('/getCoordenadas', function (req, res) {
    let sql = 'SELECT ORIGIN_LONGITUDE,ORIGIN_LATITUDE,DESTINATION_LONGITUDE,DESTINATION_LATITUDE,NAME FROM SIMULATION_DATA ORDER BY NAME DESC LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


app.get('/getEstatisticas2', function (req, res) {
    let sql = "SELECT DISTINCT 'BUS' AS Transport, COUNT(*) AS Number FROM im_sim_0_pt_checks AS Number WHERE CHECK_TYPE LIKE '%BUS%' UNION SELECT DISTINCT 'TRAIN' AS Transport, COUNT(*) AS Number FROM im_sim_0_pt_checks AS Number WHERE CHECK_TYPE LIKE '%TRAIN%' UNION SELECT DISTINCT 'SUBWAY' AS Transport, COUNT(*) AS Number FROM im_sim_0_pt_checks AS Number WHERE CHECK_TYPE LIKE '%SUBWAY%';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/getEstatisticas3', function (req, res) {
    let sql = "SELECT concat(HOUR(CONVERT(DATE_TIME, DATETIME)), '-', HOUR(CONVERT(DATE_TIME, DATETIME)) + 1) as Hour, COUNT(*) AS Number FROM simulation_data group by 1 ORDER BY HOUR(CONVERT(DATE_TIME, DATETIME))";
    db.query(sql, (err, result) => {
        if (err) throw err;
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
            res.send(rows[0].username);
        }
    });
});


app.post('/submit', function (req, res) {
    console.log(req.body);
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var checkpassword = req.body.checkpassword;

    req.checkBody('username', ' Campo obrigatório').notEmpty();
    req.checkBody('email', ' Campo obrigatório').notEmpty();
    req.checkBody('password', ' Campo obrigatório').notEmpty();
    req.checkBody('checkpassword', ' Passwords não coincidem').equals(req.body.password);


    var errors = req.validationErrors();

    //console.log(errors);

    if (errors) {
        //dá erro

        res.writeHead(300, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(errors));
        res.send();
    } else {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            let sql = "INSERT INTO `user` (`id`, `username`, `email`, `password`,`checkpassword`) VALUES (NULL, '" + username + "', '" + email + "', '" + hash + "', '" + hash + "');"

            db.query(sql, [username, email, password, checkpassword], function (err) {
                if (err) throw err;
                res.sendFile(__dirname + '/client/index.html');
            });

        });
    };
});



// Connect Flash
app.use(flash());
