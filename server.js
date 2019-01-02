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
var router = express.Router();




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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!!!');
});


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

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


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
router.get('/submit', function (req, res) {
       res.redirect("/");
});


app.post('/submit', function (req, res) {
    console.log(req.body);
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var checkpassword = req.body.checkpassword;


    console.log(username, email);


    var sql = 'INSERT INTO user (username,email,password,checkpassword) VALUES (? , ? , ? , ?)';

    db.query(sql,[username , email, password, checkpassword] ,function (err) {
        if (err) throw err;
          res.redirect("/");
    });

});
