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

    res.render('assessment', { isAdmin: isAdmin });
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

    var emails = mails.split(",");
    var emailsLength = emails.length;

    var passwords = generator.generateMultiple(emailsLength, {
        length: 10,
        numbers: true
    });

    var userId;
    var testId;
    var ctr = 0;

    emails.forEach(async (email) => {
        console.log(email);
        console.log(passwords[ctr]);
        var userId = await createUserAuth(email, passwords[ctr]);
        var testId = await createCandidateUserAccount(userId, email, testName, timestamp);
        await addTestQuestions(userId, testName);
        await sendEmail(email, passwords[ctr], dateTime);
        ctr++;
    }).then(() => {
        console.log('done!');
    })


});

function createUserAuth(emailAddress, password) {
    var userId = "";
    return new Promise((resolve, reject) => {
        fb.auth().createUser({
            email: emailAddress,
            password: password,
            displayName: ""
        }).then((doc) => {
            userId = doc.uid;
            resolve(userId);
        });
    });
}

function createCandidateUserAccount(userId, emailAddress, testName, timestamp) {
    console.log('User ID:' + userId);
    var testId;
    return new Promise((resolve, reject) => {
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
                }).then((doc) => {
                    testId = doc.uid;
                    resolve(testId);
                });
        });
    });
}

function addTestQuestions(userId, testName) {
    var testId = '';
    return new Promise((resolve, reject) => {
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
                        db.collection('tests')
                            .where('test_name', '==', testName)
                            .get()
                            .then(snapshot => {
                                if (snapshot.empty) {
                                    console.log('empty')
                                } else {
                                    var ctr = 0;
                                    snapshot.forEach((doc) => {
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
                                                    name: testObject['question_name'][ctr],
                                                    description: question,
                                                    type: 'code',
                                                    answer: ""
                                                });
                                            ctr++;
                                        })
                                    })
                                }
                            }).then(() => {
                                resolve('done');
                            })
                    })
                }
            })
    });
}

function sendEmail(emailAddress, password, dateTime) {
    var sender = 'noreply@maptek.com';
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hiremecoder.pg5@gmail.com',
            pass: 'Sep_group5'
        }
    });
    return new Promise((resolve, reject) => {
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
                'is indicated below. You may change your password under Profile Page. \n\n' +
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
    });
    resolve();
}

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