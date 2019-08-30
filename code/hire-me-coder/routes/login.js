var express = require('express');
var router = express.Router();

var firebase = require('firebase-admin');
var serviceAccount = require('../sep-2019-pg5-39ccb-firebase-adminsdk-yivcu-073cc6edb0.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://hireme-coder.firebaseio.com'
});

//Login page
router.get('/', function(req, res, next) {
  res.render('login', { layout: false });
});

router.post('/', function(req, res, next) {

 
    
    
  // // Web app's Firebase configuration
  // const firebaseConfig = {
  //     apiKey: "AIzaSyC49UseYKNdFnCuUV7Fpq-4ZjkIEL1IDCI",
  //     authDomain: "sep-2019-pg5-39ccb.firebaseapp.com",
  //     databaseURL: "https://sep-2019-pg5-39ccb.firebaseio.com",
  //     projectId: "sep-2019-pg5-39ccb",
  //     storageBucket: "sep-2019-pg5-39ccb.appspot.com",
  //     messagingSenderId: "989504657582",
  //     appId: "1:989504657582:web:2d2dc47a72c6ae77"
  // };
  // // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);
  
  
  // Get elements
  

  const txtEmail = req.param('email');
  const txtPassword = req.param('password');
  const btnLogin = req.param('btnLogin');
  const btnLogout = req.param('btnLogout');
  const btnAdmin = req.param('btnAdmin');
 
  
  // Add login event
  btnLogin.addEventListener('click', e => {
      // Get email and pwd
      const email = txtEmail.value;
      const password = txtPassword.value;
      const auth = firebase.auth();
      
      // Sign in
      const promise = auth.signInWithEmailAndPassword(email, password);
      promise.catch(e => console.log(e.message));
  }); 
  
  
  //Add logout event
  btnLogout.addEventListener('click', e=> {
      firebase.auth().signOut();
  });


  // //Add go admin
  // btnAdmin.addEventListener('click', e=>{
  //     login
  //     res.redirect('http://google.com')
  // })


  
  
  
  
  // Add a realtime listner
  firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) {
          console.log('logged in');
          
          loginGroup.style.display="none";
          logoutGroup.style.display="block";
          // return res.redirect('/admin');
          
      } else {
          console.log('not logged in');
          
          logoutGroup.style.display="none";
          loginGroup.style.display="block";
          
      }
  
  });
  
  });



module.exports = router;



