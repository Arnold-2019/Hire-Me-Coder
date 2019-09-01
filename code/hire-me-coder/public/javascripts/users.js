var results;
$(document).ready(function () {
    // loadAdminDetails();
});

function loadAdminDetails() {
    $.ajax({
        url: '/users/manage-users',
        method: 'GET',
        success: function (data) {
            console.log(data);
            results = data;
        }, error: function (req, res) {
            console.log(res.body);
        }
    });
}

$("#addAdminForm").submit(function(event) {
    event.preventDefault();
    var firstName = $('#firstName').val();
    var lastName =  $('#firstName').val();
    var email = $('#email').val();
    var role = 'admin';

    let user = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
    };

    $.ajax({
        url: '/users/save',
        method: "POST",
        data: {"firstName": firstName, "lastName": lastName, "email": email},
        success: function (data) {
            successAlert();
        }, error: function(e) {
            errorAlert();   
        }
    }).done(function (params) {

    }
        
    );
});

$('#cancelBtn').click(function () {
    resetSaveAdmin();
});

function successAlert() {
    swal({
        title: "Registered!",
        text: "Admin user has been successfully added.",
        type: "success"
    }, function () {
        resetSaveAdmin();
        loadAdminDetails();
        location.reload();
    });
}

function errorAlert(params) {
    swal("Error", "User is already registered", "error");
}

function resetSaveAdmin() {
    $('#addAdminForm').get(0).reset();
    $('#registerModal').modal('hide'); 
}



