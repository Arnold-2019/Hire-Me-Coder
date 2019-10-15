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
router.post('/send-assessment', async function (req, res, next) {
    console.log('-----TEST LINE---- 2');
    res.setHeader('Content-Type', 'text/plain');
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


    for (i = 0; i < numMails; i++) {
        var emailAddress = maillist[i];
        var password = passwords[i];
        await createAccount(emailAddress, password, testName, timestamp);
    }

});

async function createAccount(email, password, testName, timestamp) {
    let userId = await createAuth(email, password);
    let candidate = await createCandidateAccount(userId, email);
    let testId = await createTest(userId, testName);
    let question = await addTestQuestions(userId, testId, testName)

    console.log(userId);
}

async function createAuth(email, password) {
    return new Promise((resolve, reject) => {
        fb.auth().createUser({
            email: email,
            password: password,
            displayName: ""
        }).then(cred => {
            resolve(cred.uid);
        })
    })
}

async function createCandidateAccount(userId, emailAddress) {
    console.log(userId);
    return new Promise((resolve, reject) => {
        db.collection('candidate_users')
            .doc(userId)
            .set({
                firstName: '',
                lastName: '',
                email: emailAddress,
                isActive: false
            });
    });
}

async function createTest(userId, testName, timestamp) {
    console.log(userId, testName);
    return new Promise((resolve, reject) => {
        db.collection('candidate_users')
            .doc(userId)
            .collection('tests')
            .set({
                dueDate: timestamp,
                isActive: false,
                isLatest: true,
                isSubmitted: false,
                testName: testName
            }).then(doc => {
                resolve(doc.id);
            })
    })
}

async function addTestQuestions(userId, testId, testName) {
    return new Promise((resolve, reject) => {
        db.collection('tests')
            .where('test_name', '==', testName)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    res.send('empty');
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
                }
            })
    })
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