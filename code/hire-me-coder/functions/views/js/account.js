// // Firebase App (the core Firebase SDK) is always required and must be listed first
// import * as firebase from "firebase/app";

// // Add the Firebase products that you want to use
// import firebase/auth;
// import "firebase/database";
// import "firebase/firestore";

(function() {

    // Web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyD8s6-0LuLSfNT2Qb80o4icD8ES1pOSR08",
        authDomain: "hireme-coder.firebaseapp.com",
        databaseURL: "https://hireme-coder.firebaseio.com",
        projectId: "hireme-coder",
        storageBucket: "hireme-coder.appspot.com",
        messagingSenderId: "705493928337",
        appId: "1:705493928337:web:e3bd0ceff64cbc5d"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get elements
    const btnLogout = document.getElementById('btnLogout');
    const btnAdmin = document.getElementById('btnAdmin');
    const btnUpdatepassword = document.getElementById('btnUpdatePassword');
    // Get elements
    var newPassword = document.getElementById('newPassword'); 
    var confirmPassword = document.getElementById('confirmPassword'); 
    const btnUpdate = document.getElementById('btnUpdate');
    const update_password =document.getElementById('update_password');


    //Add logout event
    btnLogout.addEventListener('click', e=> {
        firebase.auth().signOut();
    });

    //Go Admin
    btnAdmin.addEventListener('click', e=> {
        location.href='/users';
    })

    //Reset display function
    function reset(){
        document.getElementById('reset_success').style.display="none";
        document.getElementById('different_error').style.display="none";
        document.getElementById('digit_error').style.display="none";
    }
   // Change Password
   update_password.addEventListener('submit', e => {
        e.preventDefault();
        var user = firebase.auth().currentUser;
        var newPasswordValue = newPassword.value;
        var confirmPasswordValue = confirmPassword.value;
        if (newPasswordValue===confirmPasswordValue && newPasswordValue.length >=6){
            
        user.updatePassword(newPasswordValue).then(function() {
            // Update successful.     
                
            console.log('new password ' + newPasswordValue);
            reset();
            document.getElementById('reset_success').style.display="block";
            //    location.href='/login/account';
            return newPasswordValue;
            }).catch(function(error) {
            // An error happened.
            console.log(e.message);
            });
        } else {
            if (newPasswordValue!==confirmPasswordValue && newPasswordValue.length >=6){
                reset();
                document.getElementById('different_error').style.display="block";
                console.log('error ' + newPasswordValue);
            }
            else if (newPasswordValue===confirmPasswordValue && newPasswordValue.length <6){
                reset();
                document.getElementById('digit_error').style.display="block";
            }
            else {
                reset();
                document.getElementById('different_error').style.display="block";
                document.getElementById('digit_error').style.display="block";
            }
            
       }    
   }); 

    // Add a realtime listner
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log('logged in');
            // location.href='/login/account';
        } else {
            console.log('not logged in');
            location.href='/login'
        }
    });

    
    
    }());


