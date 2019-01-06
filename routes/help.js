var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.post('/', function (req, res, next) {
    var data = {
        nome: req.body.nome,
        apelido: req.body.apelido,
        localidade: req.body.localidade,
        email: req.body.email,
        telefone: req.body.telefone,
        assunto: req.body.assunto,
        mensagem: req.body.mensagem,
    };

    req.checkBody('nome', ' Campo obrigatório').notEmpty();
    req.checkBody('apelido', ' Campo obrigatório').notEmpty();
    req.checkBody('localidade', ' Campo obrigatório').notEmpty();
    req.checkBody('email', ' Campo obrigatório').notEmpty();
    req.checkBody('telefone', ' Campo obrigatório').notEmpty();
    req.checkBody('assunto', ' Campo obrigatório').notEmpty();
    req.checkBody('mensagem', ' Campo obrigatório').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        //erro
        res.writeHead(300, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(errors));
        res.send();

    } else {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'comotemovesthales@gmail.com',
                pass: 'comotemoves123'
            }
        });
        const mailOptions = {
            from: req.body.email, // sender address
            to: 'comotemovesthales@gmail.com', // list of receivers
            // é o assunto que esttá no formulario
            subject: req.body.assunto, // Subject line
            //o email recebe o nome, apelido, localidade, email, telefone, e a mensagem
            html: '<p>' + req.body.nome + req.body.apelido + '</p>' + '<p>' + req.body.localidade + '</p>' + '<p>' + req.body.email + '</p>' + '<p>' +
                req.body.telefone + '</p>' + req.body.mensagem, // plain text body
        };
        transporter.sendMail(mailOptions, function (err,info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    }
    res.redirect('/dashboard.html')
});

module.exports = router;
