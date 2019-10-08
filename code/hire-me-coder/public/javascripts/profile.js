var email;
var password;
$(document).ready(function () {
    // Add a realtime listner
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (!firebaseUser) {
            console.log('not logged in');
            location.href = '/login';
        } else {
            email = firebaseUser.email;
        }
    });
})

function textValidation(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((event.charCode > 64 &&
        event.charCode < 91) || (event.charCode > 96 && event.charCode < 123))
        return true;
    return false;
}

function textValidation2(text) {
    // TODO
}

function updateProfile() {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();

    if (firstName.trim() == '' || lastName.trim() == '') {
        $.notify('Invalid input', 'error');
    } else {
        $.ajax({
            url: '/users/save-profile',
            type: 'POST',
            data: { firstName: firstName, lastName: lastName },
            success: function (data) {
                $.notify({
                    title: 'Success!',
                    icon: 'fa fa-check',
                    message: 'Profile details have been successfully updated.'
                },{
                    type: 'success'
                });
            }
        })
    }
}

function udpatePassword() {
    var currentPassword = $('#currentPassword').val();
    var newPassword = $('#newPassword').val();
    var confirmPassword = $('#confirmPassword').val();


    if (newPassword != confirmPassword) {
        $.notify({
            title: 'Error!',
            icon: 'fa fa-exclamation-circle',
            message: 'YPassword does not match.'
        },{
            type: 'danger'
        });
    } else {
        if (passwordValidation(newPassword) && passwordValidation(confirmPassword)) {
            changePassword(currentPassword, newPassword);
        } else {
            $.notify({
                title: 'Error!',
                icon: 'fa fa-exclamation-circle',
                message: 'Invalid minimum length of password'
            },{
                type: 'danger'
            });
        }
    }
}

function passwordValidation(password) {
    console.log(password);
    if (password.length < 6) {
        return false;
    }
    return true;
}

function reauthencticate(currentPassword) {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
    return user.reauthenticateWithCredential(cred);
}

function changePassword(currentPassword, newPassword) {
    const promise = reauthencticate(currentPassword);
    console.log(promise);
    promise.then(() => {
        const user = firebase.auth().currentUser;
        var updatePromise = user.updatePassword(newPassword);
        updatePromise.then(() => {
            $.notify({
                title: 'Success!',
                icon: 'fa fa-check',
                message: 'Password has been updated.'
            },{
                type: 'success'
            });
            $('#changePasswordForm').get(0).reset();
        }).catch(error => {
            $.notify({
                title: 'Error!',
                icon: 'fa fa-exclamation-circle',
                message: error.message
            },{
                type: 'danger'
            });
        })
    }).catch(error => {
        $.notify({
            title: 'Error!',
            icon: 'fa fa-exclamation-circle',
            message: error.message
        },{
            type: 'danger'
        });
        $('#changePasswordForm').get(0).reset();
    })
}