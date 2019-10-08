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
		swal({
			title: "Login Failed",
			text: "Invalid Credentials",
			type: "error"
		}, function () {
			$('#loginForm').get(0).reset();
		});
	});
}

function resetPassword() {
	var emailForReset = $('#emailForReset').val();
	console.log('resssset!');
	// if (emailForReset == '') {
	// 	swal({
	// 		title: "Error",
	// 		text: "Field is emtpy",
	// 		type: "error"
	// 	}, function () {
	// 		$('#forgetForm').get(0).reset();
	// 	});
	// }
}

$('#forgetForm').submit(function (e) {
	console.log('refrreeeesh!');
	e.preventDefault();
})