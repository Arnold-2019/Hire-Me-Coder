const express = require('express');
const bodyParser = require('body-parser');
const generator = require('generate-password');
const router = express.Router();
const fb = require('../util/db');

const db = fb.firestore();

router.get('/send-assessment', function(req, res, next) {
    res.render('assessment');
    console.log('-----TEST LINE---- 1');
    db.collection('candidate_users').get().then(docs => {
        docs.forEach(doc => {
            console.log(doc.data().email);
        })
    })
});

router.get('/preview', function(req, res) {
    console.log('assessment/preview response');
    var message = 'Response to Ajax request.';
    res.send(message);
});

router.use(bodyParser.urlencoded({extended: true})); 
router.post('/send-assessment', function (req, res, next) {
    console.log('-----TEST LINE---- 2');
    var sender = 'noreply@maptek.com';
    var numSentMails = 0;
    var mails = req.body.emails;
    var due = req.body.dueDate;
    var time = req.body.dueTime;
    var test = req.body.testName;
    console.log(mails, due, test);

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
        var emailAddress = maillist[i];
        var passWord = passwords[i];

        fb.auth().createUser({
            email: emailAddress,
            password: passWord,
            displayName: ""
        }).then(cred => {
            var candidateRef = db.collection('candidate_users').doc(cred.uid);
            candidateRef.set({
                firstName: '',
                lastName: '',
                email: emailAddress,
                testName: test,
                dueDate: due,
                dueTime: time,
                isActive: false
            }).then(() => {
                var mailOptions = {
                    from: sender,
                    to: emailAddress,
                    subject: 'MapTek Invitation!',
                    text: 'Wellcome,\n\n' + 
                          'We have kindly created an account for you, and with this account ' +
                          'you can access your assessment form.\n\n' +
                          'Please submit your solutions by the DUE DATE: ' + 
                          '  ' + due + '  ' + time + '\n\n' +
                          'Your Account name is your email address and the defult initial password ' +
                          'is attached below. Realy recommend to update your Password after logging in.\n\n' +
                          'User name: ' + emailAddress + '\n' +
                          'Password: ' + passWord + '\n\n' +
                          'Please click the link below to login to your account.\n\n' +
                          'https://hireme-coder.firebaseapp.com/login\n\n' +
                          'Best regards,\n' +
                          'MapTek Team'
                };
        
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(numSentMails);
                    } else {
                        numSentMails += 1;
                        console.log('Number of mails sent: ' + numSentMails);
                    }
                });
                res.sendStatus(200);
            }).catch(err => {
                res.sendStatus(500, {error: err});
            })
        }).catch(err => {
            console.log(err.message);
        })
    }
});

router.get('/test/view', function (req, res, next) {
    db.collection('tests').get()
    .then(function (snapshot) {
        if (snapshot.empty) {
            res.send("NO SERVERS AVAILABLE")
          } else {
            var docs = snapshot.docs.map(doc => doc.data());
            res.send(JSON.stringify({ tests: docs }));
          }
    }).catch(error => {
        res.status(500).send({error:error});
    })
})

module.exports = router;