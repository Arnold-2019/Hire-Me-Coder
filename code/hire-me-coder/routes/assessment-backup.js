/* Remain issues: 26/09/2019 2:05 pm
   1. there is a bug in sending multiple emails
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
    console.log(mails, due, time, test);

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
                        // alert(emailAddress + ' has in progressing assessment. (is active)');
                        console.log(emailAddress + ' has in progressing assessment. (is active)');
                        res.send('Active');
                    } else {
                        console.log(emailAddress + ': is NOT active!');
                        updateUser(emailAddress, due, time, test);
                        sendEmail(emailAddress,passWord,due, time);
                        res.send('NotActive');
                        // res.sendStatus(200);
                    }
                })
            } else {
                console.log(emailAddress + ': was created!');
                createCandidate(emailAddress, passWord, due, time, test);
                sendEmail(emailAddress, passWord, due, time);
                res.send('NotExist');
                // res.sendStatus(200);
            }
        });
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
                var due = doc.data().dueDate;
                var time = doc.data().dueTime;
                dueTime = formatTime(due, time);
                var dueTime = new Date(dueTime);
                var currentTime = new Date();
                console.log('expiryTime: ' + dueTime);
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

async function updateUser(userEmail, due, time, test) {
    await db.collection('candidate_users').get().then(docs => {
        docs.forEach(document => {
            if (document.data().email === userEmail) {
                // cannot get the doc and update info.
                db.collection('candidate_users').doc(document.data().id).update({
                    dueDate: due,
                    dueTime: time,
                    testName: test
                });
                console.log('Data base has been updated!!!!');
                return
            }
        });
    });
}

function formatTime(date, time) {
    dateArr = date.split('/')
    d = dateArr[0]
    m = dateArr[1]
    y = dateArr[2]

    timeArr = time.split(' ')
    time = timeArr[0]
    time_arr = time.split(':')
    hour = time_arr[0]
    minute = time_arr[1]
    switch (timeArr[1]) {
        case 'PM':
            hour = (Number(hour) + 12).toString(10)
    }
    time = hour + ':' + minute + ':00'

    month = ''
    switch (m) {
        case '01': month = 'January'; break;
        case '02': month = 'February'; break;
        case '03': month = 'March'; break;
        case '04': month = 'April'; break;
        case '05': month = 'May'; break;
        case '06': month = 'June'; break;
        case '07': month = 'July'; break;
        case '08': month = 'August'; break;
        case '09': month = 'September'; break;
        case '10': month = 'October'; break;
        case '11': month = 'November'; break;
        case '12': month = 'Desember'
    }

    dueTime = month + ' ' + d + ', ' + y + ' ' + time
    return dueTime
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
            id: cred.uid,
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