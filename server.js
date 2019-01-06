var express = require('express');
var bodyParser = require('body-parser')
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var expressValidator = require('express-validator');
var passport = require('passport');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var http = require('http');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
var app = express();
var router = express.Router();
var path = require('path');
var db = require('./db');
const saltRounds = 10;
var register = require('./routes/register');
var login = require('./routes/login');
var help = require('./routes/help');

//sendFile(__dirname+'/public..)

app.listen(3000, function () {
    console.log('Example app listening on port 3000!!!');
});

app.use(cookieParser());
app.use(express.static('client'));

//express mysql session
const options = {
    host: 'localhost',
    port: 3310,
    user: 'root',
    password: '',
    database: 'thales2018',
    socketPath: "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock"
};
var sessionStore = new MySQLStore(options);

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
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// parse application/json

//coordenadas user mapa
app.get('/getCoordenadas', function (req, res) {
    let sql = 'SELECT ORIGIN_LONGITUDE,ORIGIN_LATITUDE,DESTINATION_LONGITUDE,DESTINATION_LATITUDE,NAME FROM SIMULATION_DATA ORDER BY NAME DESC LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
//-----------------------------------------Estatisticas----------------------------------------------------------
app.get('/getEstatisticas1', function (req, res) {
    let sql = "SELECT concat(11*floor(sd.AGE/11), '-', 11*floor(sd.AGE/11) + 10) as 'Age', COUNT(*) AS 'Number' FROM simulation_data AS sd INNER JOIN im_sim_0_pt_checks AS im ON sd.USER_ID = im.USER_ID group by 1 ORDER BY sd.AGE;";
    console.log(sql);
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

//logout
app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

//writing user data in the session
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

//retrieving user datafrom the session
passport.deserializeUser(function (user_id, done) {

    done(null, user_id);
});

app.use('/login', login);
app.use('/dashboard', login);
app.use('/submit', register);
app.use('/comunicar',help);
