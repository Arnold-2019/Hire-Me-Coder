"use strict";
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

$('#createQuestionForm').submit(function (event) {
    event.preventDefault();
    let name = $('#name').val();
    let description = $('#description').val();
    let imageFile = document.getElementById("imageFile");
    // let imageFile = $('#imageFile');
    let createdBy = 'Mary Miller';

    console.log(imageFile.value);
    console.log(imageFile.files.length);

    let code = $('#newCodeRadio');
    let descriptive = $('#newDescriptiveRadio');
    let type;

    if (code[0].checked == true) {
        type = code.val();
    } else if (descriptive[0].checked == true) {
        type = descriptive.val();
    }

    const data = new FormData();
    

    if (imageFile.files.length > 0) {
        var isValid = validateImageFile(imageFile.value);
        if (isValid) {

            data.append('file', imageFile.files[0]);
            data.append('type', type);
            data.append('testName', name);
            data.append('description', description);
            data.append('createdBy', createdBy);

            console.log('upload imageee!');
            $.ajax({
                url: '/questions/save',
                method: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: function (data) {
                    successAlert();
                }, error: function (err) {
                    alert(err);
                }
            });
        }
    } else {
        console.log('no image!');
        $.ajax({
            url: '/questions/save',
            method: 'POST',
            data: {
                "type": type,
                "testName": name,
                "description": description,
                "createdBy": createdBy,
                "imageFile": null
            }, success: function (data) {
                successAlert();
            }, error: function (err) {
                alert(err);
            }
        });
    }
});

function validateImageFile(imageFile) {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(imageFile)) {
        imageFileErrAlert();
        return false;
    }
    return true;
};

function imageFileErrAlert() {
    swal("Error", "Invalid image format.\n Please upload .jpg, .jpeg, .png, .gif", "error");
};

function successAlert() {
    swal({
        title: "Success!",
        text: "Question has been created successfully",
        type: "success"
    }, function () {
        resetQuestionForm();
        loadViewTest();
        location.reload();
    });
}

function resetQuestionForm() {
    $('#createQuestionForm').get(0).reset();
    $('#createQuestionModal').modal('hide');
};

function loadViewTest() {
    $.ajax({
        url: '/questions/view',
        method: 'GET',
        success: function (data) {
            console.log(data);
            results = data;
        }, error: function (req, res) {
            console.log(res.body);
        }
    });
};


function viewQuestion(question) {
    $('#problemName').text(question['name']);
    $('#createdBy').text(question['createdBy']);
    $('#type').text(question['type']);
    $('#viewDescription').text(question['description']);
    document.getElementById('problemImage').src = question['photoUrl'];

    $('#viewQuestionModal').modal('show');
};

function updateQuestion(question) {
    $('#updateTestName').val(question['name']);
    $('#updateDescription').val(question['description']);
    $('#oldQuestionName').text(question['name']);

    let type = question['type'];
    if (type == 'Code') {
        document.getElementById('codeRadio').checked = true;
    } else if (type == 'Descriptive') {
        document.getElementById('descriptiveRadio').checked = true;
    }

    $('#updateQuestionModal').modal('show');
};

$('#updateQuestionForm').submit(function (event) {
    event.preventDefault();
    let name = $('#updateTestName').val();
    let description = $('#updateDescription').val();
    let updatedBy = 'John Smith';
    let oldQuestionName = document.getElementById('oldQuestionName').textContent;
    let code = $('#codeRadio');
    let descriptive = $('#descriptiveRadio');
    let type;

    if (code[0].checked == true) {
        type = code.val();
    } else if (descriptive[0].checked == true) {
        type = descriptive.val();
    }

    $.ajax({
        url: '/questions/update',
        method: 'POST',
        data: {
            "type": type,
            "name": name,
            "description": description,
            "updatedBy": updatedBy,
            "oldQuestionName": oldQuestionName
            // "imageFile": null
        },
        success: function (data) {
            swal({
                title: "Updated!",
                text: "Question has been updated.",
                type: "success"
            }, function () {
                $('#updateQuestionModal').modal('hide');
                location.reload();
            });
        }
    });
});

function deleteQuestion(question) {
    let testName = question['name'];

    swal({
        title: 'Delete?',
        text: 'Are you really sure you want to delete this question?',
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: '/questions/delete',
                method: 'POST',
                data: { testName: testName },
                success: function (data) {
                    swal({
                        title: "Deleted!",
                        text: "Successfully deleted!",
                        type: "success"
                    }, function () {
                        location.reload();
                    });
                }
            });
        } else {

        }
    }
    );
};