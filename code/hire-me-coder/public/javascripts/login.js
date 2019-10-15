function login() {
    // Get email and pwd
	const email = $('#email').val();
	const password = $('#password').val();
    const auth = firebase.auth();
    
	var isAdmin = false;

	// Sign in
	const promise = auth.signInWithEmailAndPassword(email, password);
	promise.then(u => {
		// Add a realtime listner
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if (firebaseUser) {
				$.ajax({
					url: '/login/authenticate',
					type: 'POST',
					dataType: 'json',
					data: { userId: firebaseUser.uid },
					success: function (data) {
						isAdmin = data['isAdmin'];
						window.location = '/login/login-success'
					}
				}).done(function () {
					console.log(isAdmin);
				})

			} else {
				location.href='/login'
			}
		});
	});

	promise.catch(e => {
		// document.getElementById('login_error').style.display = "block";
        console.log(e.message);
        $.notify({
            title: 'Login Failed!',
            icon: 'fa fa-exclamation-circle',
            message: 'You have entered invalid credentials.'
        },{
            type: 'danger'
        });
        $('#loginForm').get(0).reset();
	});
}

function resetPassword() {
    var emailForReset = $('#emailForReset').val();
    if (emailForReset == '') {
        $.notify({
            title: 'Error!',
            icon: 'fa fa-exclamation-circle',
            message: 'You have entered an invalid email.'
        },{
            type: 'danger'
        });
    } else {
        sendResetPasswordEmail(emailForReset);
    }
}

function sendResetPasswordEmail(email) {
    const promise = firebase.auth().sendPasswordResetEmail(email);
    promise.then(() => {
        $.notify({
            title: 'Success!',
            icon: 'fa fa-check',
            message: 'Email sent.'
        },{
            type: 'success'
        });
    }).catch(error => {
        console.log(error);
    })
}

$('#forgetForm').submit(function (e) {
	console.log('refrreeeesh!');
	e.preventDefault();
})