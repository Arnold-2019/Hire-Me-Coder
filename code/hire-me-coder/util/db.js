const express = require('express');
const router = express.Router();
const firebase = require('firebase-admin');

const serviceAccount = require('../firebase-service-account-key.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://hireme-coder.firebaseio.com',
    storageBucket: 'gs://hireme-coder.appspot.com'
});

module.exports = firebase;