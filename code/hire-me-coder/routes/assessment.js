const express = require('express');
const bodyParser = require('body-parser');
const generator = require('generate-password');
const router = express.Router();
const fb = require('../util/db');

const db = fb.firestore();

router.get('/send-assessment', function (req, res, next) {
    var isAdmin = req.session.user.isAdmin;
    console.log(isAdmin);

    if (!isAdmin) {
        res.redirect('/unauthorised');
    }

    res.render('assessment', {isAdmin: isAdmin});
    console.log('-----TEST LINE---- 1');
    db.collection('candidate_users').get().then(docs => {
        docs.forEach(doc => {
            console.log(doc.data().email);
        })
    })
});

router.get('/preview', function (req, res) {
    console.log('assessment/preview response');
    var message = 'Response to Ajax request.';
    res.send(message);
});

function parseDateTime(date, time) {
    var timeArr = time.split(":");
    var merediem = timeArr[1].substring(3, 5);
    var hours, minutes;

    minutes = timeArr[1].substring(0, 2) - 30;
    if (merediem == 'AM') {
        hours = timeArr[0] - 1;
    } else if (merediem == 'PM') {
        hours = Number(timeArr[0]) + 11;
    }

    var year = date.substring(6, 10);
    var month = date.substring(3, 5) - 1;
    var monthDate = date.substring(0, 2);


    console.log(year);
    console.log(month);
    console.log(monthDate);
    console.log(hours);
    console.log(minutes);


    var dateTime = new Date();
    dateTime.setFullYear(year);
    dateTime.setMonth(month);
    dateTime.setDate(monthDate);
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);
    return dateTime;

}

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/send-assessment', function (req, res, next) {
    console.log('-----TEST LINE---- 2');
    var sender = 'noreply@maptek.com';
    var numSentMails = 0;
    var mails = req.body.emails;
    var testName = req.body.testName;

    // date 
    var dueDate = req.body.dueDate;
    var dueTime = req.body.dueTime;
   
    var dateTime = parseDateTime(dueDate, dueTime);
    var timestamp = fb.firestore.Timestamp.fromDate(dateTime);

    var sec = Number(timestamp['_seconds']);
    var nano = Number(timestamp['_nanoseconds']);

    var newDate = new fb.firestore.Timestamp(sec, nano).toDate();

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

    var userId;
    var testId;

    for (var i = 0; i < numMails; i++) {
        var emailAddress = maillist[i];
        var password = passwords[i];

        fb.auth().createUser({
            email: emailAddress,
            password: password,
            displayName: ""
        }).then(cred => {
            userId = cred.uid;
            var candidateRef = db.collection('candidate_users').doc(userId);
            candidateRef.set({
                firstName: '',
                lastName: '',
                email: emailAddress,
                isActive: false
            }).then(() => {
                db.collection('candidate_users')
                    .doc(userId)
                    .collection('tests')
                    .doc()
                    .set({
                        dueDate: timestamp,
                        isActive: false,
                        isLatest: true,
                        isSubmitted: false,
                        testName: testName
                    }).then(() => {
                        db.collection('candidate_users')
                            .doc(userId)
                            .collection('tests')
                            .where('testName', '==', testName)
                            .get()
                            .then(testSnapshot => {
                                if (testSnapshot.empty) {
                                    console.log('empty');
                                } else {
                                    testSnapshot.forEach(testDoc => {
                                        testId = testDoc.id;
                                        console.log('Test ID: ' + testId);
                                        db.collection('tests')
                                            .where('test_name', '==', testName)
                                            .get()
                                            .then(snapshot => {
                                                if (snapshot.empty) {
                                                    console.log('empty');
                                                    res.send("empty")
                                                } else {
                                                    var cntr = 0;
                                                    snapshot.forEach(doc => {
                                                        var testObject = JSON.parse(JSON.stringify(doc.data()));
                                                        var questionArr = testObject['question_description'];
                                                        questionArr.forEach(question => {
                                                            db.collection('candidate_users')
                                                                .doc(userId)
                                                                .collection('tests')
                                                                .doc(testId)
                                                                .collection('questions')
                                                                .doc()
                                                                .set({
                                                                    name: testObject['question_name'][cntr],
                                                                    description: question,
                                                                    type: 'code',
                                                                    answer: ""
                                                                });
                                                            cntr++;
                                                        })
                                                    })
                                                    console.log(dateTime);
                                                    var mailOptions = {
                                                        from: sender,
                                                        to: emailAddress,
                                                        subject: 'MapTek Invitation!',
                                                        text: 'Welcome,\n\n' +
                                                            'We have created an account for you! ' +
                                                            'You can now access your assessment form.\n\n' +
                                                            'Please submit your solutions by the DUE DATE: ' +
                                                            // '  ' + due + '  ' + time + '\n\n' +
                                                            dateTime + '\n\n' +
                                                            'Your Username is your email address and the default initial password ' +
                                                            'is indicated below. You will be prompted to change your password after your first login.\n\n' +
                                                            'Username: ' + emailAddress + '\n' +
                                                            'Password: ' + password + '\n\n' +
                                                            'Please click the link below to login to your account.\n\n' +
                                                            'https://hireme-coder.firebaseapp.com/login\n\n' +
                                                            'Best regards,\n' +
                                                            'MapTek Team'
                                                    };

                                                    transporter.sendMail(mailOptions, function (error, info) {
                                                        if (error) {
                                                            console.log(numSentMails);
                                                        } else {
                                                            numSentMails += 1;
                                                            console.log('Number of mails sent: ' + numSentMails);
                                                        }
                                                    });

                                                    res.sendStatus(202);
                                                }
                                            }).then(() => {
                                            })
                                    })
                                }
                            })
                    })
            }).catch(err => {
                ``
                res.sendStatus(500, { error: err });
            })
        }).catch(err => {
            console.log(err.message);
        })
    }
});

router.get('/sample', function (req, res, next) {
    let testName = req.body['testName'];
    db.collection('tests')
        .where('test_name', '==', testName)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('empty');
                res.send("empty")
            } else {
                snapshot.forEach(doc => {
                    var testObject = JSON.parse(JSON.stringify(doc.data()));
                    var questionArr = testObject['question_description'];
                    questionArr.forEach(question => {
                        console.log(question);
                    })

                    res.send(JSON.stringify(doc.data()))
                })
            }
        })
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
            res.status(500).send({ error: error });
        })
})

module.exports = router;