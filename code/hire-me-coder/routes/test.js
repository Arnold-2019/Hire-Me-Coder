var express = require('express');
var router = express.Router();
var session = require('express-session');
const fb = require('../util/db');

var db = fb.firestore();

//test page
router.get('/', function (req, res, next) {
  res.send('test');
});

router.get('/create-test', function (req, res, next) {
  res.render('create-test', { layout: false });
});

router.get('/manage-test', function (req, res, next) {
  res.render('manage-test', { layout: false });
});


router.get('/candidate/take-test', function (req, res, next) {
  res.render('take-test');
})


router.get('/view', function (req, res, next) {
  let testName = req.body['testName'];
  console.log(testName);
  let testRef = db.collection('tests');
  let query = testRef.where('test_name', '==', testName).get().then(
    snapshot => {
      if (snapshot.empty) {
        let message = 'No matching documents.';
        res.sendStatus(500, { error: message })
      } else {
        var docs = snapshot.docs.map(doc => doc.data());
        res.send(JSON.stringify({ test: docs }));
      }
    }
  ).catch(function (err) {
    console.log(err);
  });
})

router.post('/candidate/get-test', function (req, res, next) {
  var userId = req.session.user.userId;
  var testId = req.session.testId;
  // let candidateEmail = req.body['email'];
  var candidateTestRef = db.collection('candidate_users');
  var questions;

  candidateTestRef
    .doc(userId)
    .collection('tests')
    .doc(testId)
    .collection('questions')
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        let message = 'No matching documents.';
        res.sendStatus(500, { error: message })
      } else {
        questions = snapshot.docs.map(doc => doc.data());
        res.send(JSON.stringify(
          {
            userId: userId,
            testId: testId,
            questions: questions
          }));
      }
    }).catch(err => {
      res.sendStatus(500, {error: err});
    })


  // candidateTestRef.where('email', '==', candidateEmail).get().then(
  //   snapshot => {
  //     if (snapshot.empty) {
  //       let message = 'No matching documents.';
  //       res.sendStatus(500, { error: message })
  //     } else {
  //       // var docs = snapshot.docs.map(doc => doc.data());
  //       // res.send(JSON.stringify({ test: docs }));

  //       // test collection
  //       snapshot.forEach(doc => {
  //         userId = doc.id;
  //         candidateTestRef.doc(userId).collection('tests').get().then(testDoc => {
  //           test = testDoc.docs.map(x => x.data());
  //           testDoc.forEach(doc => {
  //             testId = doc.id;
  //             // code_question test
  //             console.log(userId);
  //             console.log(testId);
  //             var codePromise = new Promise((resolve, reject) => {
  //               candidateTestRef.doc(userId)
  //                 .collection('tests').doc(testId)
  //                 .collection('questions')
  //                 .get()
  //                 .then(codeDoc => {
  //                   code = codeDoc.docs.map(codeDoc => codeDoc.data());
  //                   resolve(code);
  //                 })
  //             });

  //             // var descPromise = new Promise((resolve, reject) => {
  //             //   //description_question
  //             //   candidateTestRef.doc(userId)
  //             //     .collection('test').doc(testId)
  //             //     .collection('description_questions')
  //             //     .get()
  //             //     .then(descDoc => {
  //             //       desc = descDoc.docs.map(descDoc => descDoc.data());
  //             //       resolve(desc);
  //             //     })
  //             // });

  //             Promise.all([codePromise]).then(function () {
  //               // res.render('take-test', { tests: test, questions: code })
  //               res.send(JSON.stringify({ userId: userId, testId: testId, tests: test, questions: code }));
  //             })
  //           })
  //         })
  //       })
  //     }
  //   }).then(function () {

  //   })
});

router.get('/candidate/view', function (req, res, next) {
  res.render('take-test');
});


router.post('/candidate/question/save', function (req, res, next) {
  let userId = req.body['userId'];
  let testId = req.body['testId']
  let questionName = req.body['questionName'];
  let answer = req.body['answer'];
  let candidateTestRef = db.collection('candidate_users');

  candidateTestRef.doc(userId)
    .collection('tests')
    .doc(testId)
    .collection('questions').where('name', '==', questionName)
    .get()
    .then(questionDoc => {
      questionDoc.forEach(doc => {
        candidateTestRef.doc(userId)
          .collection('tests')
          .doc(testId)
          .collection('questions')
          .doc(doc.id)
          .update({
            answer: answer
          }).then(function () {
            res.sendStatus(200);
          })
      });
    }).catch(err => {
      res.sendStatus(500, { error: err });
    })
});

router.post('/candidate/submit', function (req, res, next) {
  console.log('hellloooooooo!');
  
  let userId = req.body['userId'];
  let testId = req.body['testId'];
  let candidateTestRef = db.collection('candidate_users');
  let timestamp = fb.firestore.FieldValue.serverTimestamp();

  console.log(userId);
  console.log(testId);

  candidateTestRef.doc(userId)
    .collection('tests')
    .doc(testId)
    .update({
      "isSubmitted": true,
      "submittedDate": timestamp,
      "isActive": false
    }).then(function () {
      res.sendStatus(200);
    });
});

router.get('/candidate', function (req, res, next) {
  var userId = req.session.user.userId;
  let candidateTestRef = db.collection('candidate_users');
  candidateTestRef
    .doc(userId)
    .collection('tests')
    .where('isLatest', '==', true)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('collection empty');
        res.sendStatus(500, { message: 'Collection empty!' })
      } else {
        snapshot.forEach(doc => {
          req.session.testId = doc.id;
          var testObject = JSON.parse(JSON.stringify(doc.data()));
          // convert timestamp to date
          var ts = testObject['dueDate'];
          var sec = Number(ts['_seconds']);
          var nano = Number(ts['_nanoseconds']);

          var newDate = new fb.firestore.Timestamp(sec, nano).toDate();
          var today = new Date();

          if (newDate < today) {
            console.log('expired');
            res.render('candidate-duedate-expired');
          } else if (testObject['isActive'] == true && testObject['isSubmitted'] == false) {
            console.log('resume');
            res.render('candidate-resume', { dueDate: newDate.toDateString() })
          } else if (testObject['isActive'] == false && testObject['isSubmitted'] == true) {
            console.log('isSubmitted');
            res.render('candidate-submitted');
          } else {
            console.log('start');
            res.render('candidate', { dueDate: newDate.toDateString() });
          }
        })
      }
    })
});

router.post('/candidate/startTest', function (req, res, next) {
  var userId = req.session.user.userId;
  var testId = req.session.testId;
  var candidateTestRef = db.collection('candidate_users');

  candidateTestRef
    .doc(userId)
    .collection('tests')
    .doc(testId)
    .update({
      isActive: true
    }).then(function () {
      res.sendStatus(200);
    }).catch(err => {
      res.sendStatus(500, { error: err })
    });
})



module.exports = router;