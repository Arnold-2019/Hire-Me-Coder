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

$("#addAdminForm").submit(function (event) {
    event.preventDefault();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
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
        data: { "firstName": firstName, "lastName": lastName, "email": email },
        success: function (data) {
            successAlert('Registered!', 'Admin user has been successfully added.', "save");
        }, error: function (e) {
            errorAlert();
        }
    }).done(function (params) {

    }

    );
});

$('#cancelBtn').click(function () {
    resetSaveAdmin();
});

function successAlert(title, message, actionType) {
    swal({
        title: title,
        text: message,
        type: "success"
    }, function () {
        if(actionType == 'save') {
            resetSaveAdmin();
        } else if (actionType == 'edit') {
            dismiss();
            resetEditAdmin();
        }        
        loadAdminDetails();
        location.reload();
    });
}

function errorAlert(params) {
    swal({
        title:"Error", 
        text: "User is already registered", 
        type:"error"
    }, function() {
        $('#registerModal').modal('hide');
        location.reload();
    });
    
}

function resetSaveAdmin() {
    $('#addAdminForm').get(0).reset();
    $('#registerModal').modal('hide');
}

function resetEditAdmin() {
    $('#editAdminForm').get(0).reset();
    $('#updateModal').modal('hide');
}

function udpateStatus(data, status) {
    event.preventDefault();

    $.ajax({
        url: '/users/set-status',
        method: "POST",
        data: { "email": data['email'], "status": status },
        success: function (data) {
            successNotification();
            loadAdminDetails();
            location.reload();
        }, error: function (e) {
            errorAlert();
        }
    }).done(function (params) {
    }
    );
}

function successNotification() {
    $.notify({
        title: "Update Complete : ",
        message: "Status has been updated!",
        icon: 'fa fa-check'
    }, {
        type: "info"
    });
}

function updateAdminUserInfo(data) {
    $('#updateFirstName').val(data['firstName']);
    $('#updateLastName').val(data['lastName']);
    $('#updateEmail').val(data['email']);
    $('#updateModal').modal('show');
}

$("#editAdminForm").submit(function (event) {
    event.preventDefault();
    var firstName = $('#updateFirstName').val();
    var lastName = $('#updateLastName').val();
    var email = $('#updateEmail').val();

    let user = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
    };

    $.ajax({
        url: '/users/update',
        method: "POST",
        data: { "firstName": firstName, "lastName": lastName, "email": email },
        success: function (data) {
            successAlert('Updated!', 'User info has been updated.', 'edit');
        }, error: function (e) {
            errorAlert();
            loadAdminDetails();
            location.reload();
        }
    }).done(function (params) {

    }

    );
});

function textValidation(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode != 46 && charCode > 31
    //     && (charCode < 48 || charCode > 57))

    if ((event.charCode > 64 && 
        event.charCode < 91) || (event.charCode > 96 && event.charCode < 123))
        return true;
    return false;
}

function dismiss(e) {
    $('#updateModal').modal('hide');
}