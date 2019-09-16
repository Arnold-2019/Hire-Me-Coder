const express = require('express');
var generator = require('generate-password');
const router = express.Router();

router.get('/send-assessment', function(req, res, next) {
    res.render('assessment');
    console.log('-----TEST LINE---- 1');
});

router.get('/preview', function(req, res) {
    console.log('assessment/preiew response');
    var message = 'Response to Ajax request.';
    res.send(message);
});

router.post('/send-assessment', function (req, res, next) {
    console.log('-----TEST LINE---- 3');
    var sender = 'noreply@maptek.com';
    var mails = req.param('inputEmailBox');
    var tests = req.param('inputAssBox');
    var due = req.param('inputDateBox');

    var maillist = mails.split(",");
    var numMails = maillist.length;

    var passwords = generator.generateMultiple(numMails, {
        length: 10,
        numbers: true
    });

    var nodemailer = require('nodemailer');
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hiremecoder.pg5@gmail.com',
            pass: 'Sep_group5'
        }
    });

    for (var i = 0; i < numMails; i++) {
        var mailOptions = {
            from: sender,
            to: maillist[i],
            subject: 'MapTek Invitation!',
            text: 'Wellcome,\n\n' + 
                  'We have kindly created an account for you, and with this account ' +
                  'you can access your assessment form.\n\n' +
                  'Please submit your solutions by the DUE DATE: ' + 
                  '                  ' + due + '\n\n' +
                  'Your Account name is your email address and the defult initial password ' +
                  'is attached below. Realy recommend to update your Password after logging in.\n\n' +
                  'User name: ' + maillist[i] + '\n' +
                  'Password: ' + passwords[i] + '\n\n' +
                  'Please click the link below to login to your account.\n\n' +
                  '\" THE LINK TO LOGIN TO HIRE ME CODER \"\n\n' +
                  'Best regards,\n' +
                  'MapTek Team'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.send('Sent Assessment Failed!');
            } else {
                console.log('Email sent! \n' + info.response);
                res.send('Assessments have been successfully sent to: \n' + mails);
            }
        });
    }
});

module.exports = router;