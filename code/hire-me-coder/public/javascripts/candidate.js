$(document).ready(function () {
    // Add a realtime listner
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (!firebaseUser) {
            console.log('not logged in');
            location.href = '/login';
        }
    });
});

var termsCheck = document.getElementById('termsCheck');
termsCheck.onchange = function () {
    document.getElementById('startTestButton').disabled = !this.checked;
}

function startTest() {
    email = 'b@b.com';
    console.log(email);
    $.ajax({
        url: '/test/candidate/startTest',
        type: 'POST',
        data: {email: email},
        success: function (data) {

        }
    }).done(function () {
        location.href = '/test/candidate/view'
    })
}