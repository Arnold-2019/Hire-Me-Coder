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
    const txtEmail = document.getElementById('email');
    const txtPassword = document.getElementById('password');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const btnAdmin = document.getElementById('btnAdmin');
    const btnChangepassword = document.getElementById('btnChangePassword');
    const loginGroup = document.getElementsByClassName('login-group')[0];
    const logoutGroup = document.getElementsByClassName('logout-group')[0];
    
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

    //Go Admin
    btnAdmin.addEventListener('click', e=> {
        location.href='/users';
    })

    // Change pwd
    btnChangepassword.addEventListener('click', e=> {
        location.href='/login/changePassword';
    })

    // Add a realtime listner
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log('logged in');
            loginGroup.style.display="none";
            logoutGroup.style.display="block";
        } else {
            console.log('not logged in');
            logoutGroup.style.display="none";
            loginGroup.style.display="block";
        }
    });
    
    }());


