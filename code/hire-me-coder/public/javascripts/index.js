$(document).ready(function () {
    // Add a realtime listner
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            
        } else {
            console.log('not logged in');
            location.href='/login';
        }
    });
})