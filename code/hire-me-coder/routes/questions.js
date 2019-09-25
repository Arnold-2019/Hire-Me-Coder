"use strict";

const express = require('express');
const router = express.Router();
const fb = require('../util/db');
const format = require('util');

const Multer = require('multer');
const db = fb.firestore();

const bucket = fb.storage().bucket();

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});


router.get('/view', function (req, res, next) {
    // var element = {}, question = [];
    var questions;

    var questionPromise = new Promise((resolve, reject) => {

        // db.collection('questions').get()
        // .then(snapshot => {
        //     snapshot.forEach(doc => {
        //         questions.push(doc);
        //     })
        // });

        db.collection('questions').get()
            .then(function (snapshot) {
                questions = snapshot.docs.map(doc => doc.data());
                resolve(questions);
            })
    });


    Promise.all([questionPromise]).then(function () {
        // res.send(JSON.stringify({ questions: questions }));
        res.render('manage-questions', { questionResult: questions });
    });

});

router.post('/save', multer.single("imageFile"), function (req, res, next) {
    console.log('hello world!!!');

    let type = req.body['type'];
    let testName = req.body['testName'];
    let description = req.body['description'];
    let createdBy = req.body['createdBy'];
    let imageFile = req.file;

    if (!imageFile) {
        let docRef = db.collection('questions').doc();
        docRef.set({
            type: type,
            name: testName,
            description: description,
            createdBy: createdBy,
            photoUrl: "",
            photoRef: ""
        }).then(function () {
            res.sendStatus(200);
            return next();
        }).catch(err => {
            res.status(500);
            res.render('error', { error: err })
        })
    } else {
        uploadImageToStorage(imageFile).then((url) => {
            let docRef = db.collection('questions').doc();
            docRef.set({
                type: type,
                name: testName,
                description: description,
                createdBy: createdBy,
                photoUrl: url,
                photoRef: null
            }).then(function () {
                res.status(200).send({
                    status: 'success'
                });
                return next();
            }).catch(err => {
                res.status(500);
                res.render('error', { error: err })
            })
        }).catch(err => {
            res.status(500).send({
                error: err
            });
        })
    }
});


const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }

        let newFileName = `${file.originalname}_${Date.now()}`;
        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('finish', () => {
            const url = "https://firebasestorage.googleapis.com/v0/b/hireme-coder.appspot.com/o/" + newFileName + "?alt=media";
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}

router.post('/delete', function (req, res, next) {
    let testName = req.body['testName'];
    console.log(testName);
    let questionRef = db.collection('questions');
    let query = questionRef.where('name', '==', testName).get().then(
        snapshot => {
            if (snapshot.empty) {
                let message = 'No matching documents.';
                res.sendStatus(500, { error: message })
            }

            snapshot.forEach(doc => {
                questionRef.doc(doc.id).delete().then(function () {
                    let message = 'Document has been successfully deleted';
                    res.sendStatus(200, message);
                }).catch(err => {
                    res.sendStatus(500);
                });
            });
        }
    ).catch(err => {
        res.sendStatus(500, { error: err });
    });
});

router.post('/update', function (req, res, next) {
    let oldQuestionName = req.body['oldQuestionName'];
    let name = req.body['name'];
    let description = req.body['description'];
    let type = req.body['type'];
    let updatedBy = req.body['updatedBy'];

    console.log(name);
    console.log(description);
    console.log(type);
    console.log(updatedBy);

    let questionRef = db.collection('questions');
    let query = questionRef.where('name', '==', oldQuestionName).get().then(snapshot => {
        console.log('hello1');
        if (snapshot.empty) {
            let message = 'No matching documents.';
            res.sendStatus(500, { error: message })
        }

        snapshot.forEach(doc => {
            console.log('doc: ' + doc.id);
            questionRef.doc(doc.id).update({
                name: name,
                description: description,
                type: type,
                updatedBy: updatedBy
            }).then(function () {
                console.log('success');
                res.sendStatus(200);
            }).catch(err => {
                console.log('error ' + err);
                res.sendStatus(500, { error: err });
            });
        });
    }).catch(err => {
        console.log('succes1' + err);
        res.sendStatus(500, { error: err });
    });
})

module.exports = router;