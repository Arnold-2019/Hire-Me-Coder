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
	const login_form = document.getElementById('login_form');
	
	
	// Add login event
	login_form.addEventListener('submit', e => {
		e.preventDefault();
		// Get email and pwd
		const email = txtEmail.value;
		const password = txtPassword.value;
		const auth = firebase.auth();
		
		// Sign in
		const promise = auth.signInWithEmailAndPassword(email, password);
		
		promise.catch(e => {
			document.getElementById('login_error').style.display="block";
			console.log(e.message);
		});

	}); 
	  
	
	// Add a realtime listner
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser) {
			console.log('logged in');
			location.href='/login/account';
		} else {
			console.log('not logged in');
			// location.href='/login'
		}
	});
	
	}());


