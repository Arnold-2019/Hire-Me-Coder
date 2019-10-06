/* Remain issues: 26/09/2019 2:05 pm
   1. there is a bug in sending multiple emails
   2. cannot get the correct parameters format of 'new Date()' function
*/

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
        console.log('USERS in DataBase: ');
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
        
        // Issue: because of the sync prolem, cannot send multiple emails.
        isExist(emailAddress).then(ext => {
            if (ext) {
                console.log(emailAddress + ' is existing!');
                isActive(emailAddress).then(act => {
                    if (act) {
                        console.log(emailAddress + ': is active!')
                    } else {
                        console.log(emailAddress + ': is NOT active!')
                        sendEmail(emailAddress,passWord,due, time);
                        res.sendStatus(200);
                    }
                })
            } else {
                console.log(emailAddress + ': was created!')
                createCandidate(emailAddress, passWord, due, time, test);
                sendEmail(emailAddress, passWord, due, time);
                res.sendStatus(200);
            }
        });

        // fb.auth().createUser({
        //     email: emailAddress,
        //     password: passWord,
        //     displayName: ""
        // }).then(cred => {
        //     var candidateRef = db.collection('candidate_users').doc(cred.uid);
        //     candidateRef.set({
        //         firstName: '',
        //         lastName: '',
        //         testName: test,
        //         email: emailAddress,
        //         dueDate: due,
        //         dueTime: time,
        //         // isActive: true,
        //         isSubmit: false
        //     }).then(() => {
        //         var mailOptions = {
        //             from: sender,
        //             to: emailAddress,
        //             subject: 'MapTek Invitation!',
        //             text: 'Wellcome,\n\n' + 
        //                   'We have kindly created an account for you, and with this account ' +
        //                   'you can access your assessment form.\n\n' +
        //                   'Please submit your solutions by the DUE DATE: ' + 
        //                   '  ' + due + '  ' + time + '\n\n' +
        //                   'Your Account name is your email address and the defult initial password ' +
        //                   'is attached below. Realy recommend to update your Password after logging in.\n\n' +
        //                   'User name: ' + emailAddress + '\n' +
        //                   'Password: ' + passWord + '\n\n' +
        //                   'Please click the link below to login to your account.\n\n' +
        //                   'https://hireme-coder.firebaseapp.com/login\n\n' +
        //                   'Best regards,\n' +
        //                   'MapTek Team'
        //         };
        
        //         transporter.sendMail(mailOptions, function(error, info){
        //             if (error) {
        //                 console.log(numSentMails);
        //             } else {
        //                 numSentMails += 1;
        //                 console.log('Number of mails sent: ' + numSentMails);
        //             }
        //         });
        //         res.sendStatus(200);
        //     }).catch(err => {
        //         res.sendStatus(500, {error: err});
        //     })
        // }).catch(err => {
        //     console.log(err.message);
        // })
    }
});

async function isExist(email) {
    var flag = false;
    await db.collection('candidate_users').get().then(docs => {
        docs.forEach(doc => {
            if (doc.data().email === email) {
                flag = true;
            }
        });
    });

    console.log('isExist flag: ' + flag);
    if (flag) {
        return true;
    } else {
        return false;
    }
}

async function isActive(userEmail) {
    var flag = false;
    await db.collection('candidate_users').get().then(docs => {
        docs.forEach(doc => {
            if (doc.data().email === userEmail) {
                // var due = doc.data().dueDate;
                // var time = doc.data().dueTime.substring(0,4);
                // var formatDate = due + ' ' + time + ' am';
                // console.log('due: ' + due);
                // console.log('time: ' + time);
                // console.log('formatDate: ' + formatDate);
                
                var dueTime = new Date('December 17, 2018 03:24:00');
                var currentTime = new Date();
                console.log('dueTime: ' + dueTime);
                console.log('curTime: ' + currentTime);
                
                if (dueTime.getTime() > currentTime.getTime() && !doc.data().isSubmit) {
                    flag = true;
                }
            }
        });
    });
    
    console.log('isActive flag: ' + flag);
    if (flag) {
        return true;
    } else {
        return false;
    }
}

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

function createCandidate(emailAddress, passWord, due, time, test) {
    fb.auth().createUser({
        email: emailAddress,
        password: passWord,
        displayName: ""
    }).then(cred => {
        var candidateRef = db.collection('candidate_users').doc(cred.uid);
        candidateRef.set({
            firstName: '',
            lastName: '',
            testName: test,
            email: emailAddress,
            dueDate: due,
            dueTime: time,
            // isActive: true,
            isSubmit: false
        })
    })
}

function sendEmail(emailAddress, password, due, time) {
    var sender = 'noreply@maptek.com';
    var nodemailer = require('nodemailer');
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hiremecoder.pg5@gmail.com',
            pass: 'Sep_group5'
        }
    });
      
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
                'Password: ' + password + '\n\n' +
                'Please click the link below to login to your account.\n\n' +
                'https://hireme-coder.firebaseapp.com/login\n\n' +
                'Best regards,\n' +
                'MapTek Team'
    };

    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            console.log(err.message);
        } else {
            console.log('Email has been sent to: ' + emailAddress);
        }
    });
}

module.exports = router;