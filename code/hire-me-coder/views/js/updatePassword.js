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
    var newPassword = document.getElementById('newPassword'); 
    var confirmPassword = document.getElementById('confirmPassword'); 
    const btnUpdate = document.getElementById('btnUpdate');

    // Change Password
    btnUpdate.addEventListener('click', e => {
        var user = firebase.auth().currentUser;
        var newPasswordValue = newPassword.value;
        var confirmPasswordValue = confirmPassword.value;
        if (newPasswordValue==confirmPasswordValue){
          
        user.updatePassword(newPasswordValue).then(function() {
            // Update successful.           
            console.log('new password ' + newPasswordValue);
            location.href='/login/account';
            }).catch(function(error) {
            // An error happened.
            });
        } else {
            console.log('error ' + newPasswordValue);
        }    
    }); 
      
    
    
    }());