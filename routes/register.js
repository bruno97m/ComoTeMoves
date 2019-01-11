var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
var db = require('../db');
var nodemailer = require('nodemailer');



router.post('/', function (req, res) {
    console.log(req.body);
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var checkpassword = req.body.checkpassword;

    req.checkBody('username', ' Campo obrigatorio').notEmpty();
     req.checkBody('username', ' Campo obrigatorio').notEmpty();
    req.checkBody('email', ' Campo obrigatório').notEmpty();
    req.checkBody('password', ' Campo obrigatório').notEmpty();
    req.checkBody('checkpassword', ' Passwords não coincidem').equals(req.body.password);


    const errors = req.validationErrors();

    //console.log(errors);

    if (errors) {
        console.log('erros: ${JSON.stringify(errors)}')
        res.redirect('/register.html');
    } else {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            let sql = "INSERT INTO `user` (`id`, `username`, `email`, `password`,`checkpassword`) VALUES (NULL, '" + username + "', '" + email + "', '" + hash + "', '" + hash + "');"

            db.query(sql, function (err, result) {
                if (err) throw err;

                let sql = "SELECT LAST_INSERT_ID() as user_id";

                db.query(sql, function (err, result) {
                    if (err) throw err;

                    var user_id = result[0];
                    console.log(result[0]);

                    //LOGIN USER-create a session
                    req.login(user_id, function (err) {
                        console.log(hash);
                        res.redirect('/dashboard.html');

                    });

                });
            });

        });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'comotemovesthales@gmail.com',
                pass: 'comotemoves123'
            }
        });


        // formulario de email
        const mailOptions = {
            from: 'comotemovesthales@gmail.com', // sender address
            //recebe o email do cliente
            to: req.body.email, // list of receivers
            subject: 'Registo CFV', // Subject line
            html: '<p>Bem vindo </p>' // plain text body
        };

        // aqui é quando nos permite escrever o email e enviar
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    };
});

module.exports = router;
