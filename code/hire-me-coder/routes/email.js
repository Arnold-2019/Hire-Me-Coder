var express = require('express');
var generator = require('generate-password');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('send-invitation');
});

router.post('/send-invitation', function (req, res, next) {
    var sender = 'noreply@maptek.com';
    var addressee = req.param('email');

    var numPasswords = 1;
    var passwords = generator.generateMultiple(numPasswords, {
        length: 10,
        numbers: true
    });

    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hireme.coder@gmail.com',
            pass: 'sep2019gp05'
        }
    });

    var mailOptions = {
        from: sender,
        to: addressee,
        subject: 'HireMeCoder Invitation!',
        text: 'Wellcome to Hire Me Coder\n\n' + 
                'We have kindly created an account for you, and with this account ' +
                'you can access your invitation assgnments.\n\n' +
                'Your Account name is your email address and the defult initial Password ' +
                'is attached below. You should update your Password after logging in.\n\n' +
                'User name: ' + addressee + '\n' +
                'Password: ' + passwords + '\n\n' +
                'Please click the link below to login to Hime Me Coder\n\n' +
                '\" THE LINK TO LOGIN TO HIRE ME CODER \"    \n\n' +
                'Best regards,\n' +
                'Hire Me Coder Team'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

module.exports = router;