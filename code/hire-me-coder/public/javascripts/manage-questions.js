"use strict";
$('#createQuestionForm').submit(function (event) {
    event.preventDefault();
    let type = $('#questionTypeRadioOpt').val();
    let name = $('#name').val();
    let description = $('#description').val();
    let imageFile = document.getElementById("imageFile");
    // let imageFile = $('#imageFile');
    let createdBy = 'Khate Damaso';

    console.log(type);
    console.log(name);
    console.log(description);
    console.log(imageFile);
    
    const data = new FormData();


    if(imageFile!= null) {
        var isValid = validateImageFile(imageFile.value);
        if (isValid) {

            data.append('file', imageFile);

            console.log('upload imageee!');
            $.ajax({
                url: '/questions/save',
                method: 'POST',
                data : data,
                processData: false,
                contentType: false,
                // data: {
                //     "type": type,
                //     "testName": name,
                //     "description": description,
                //     "imageFile": imageFile[0],
                //     "createdBy": createdBy,
                // },
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
            url: '/tests/question/save',
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
}

function imageFileErrAlert() {
    swal("Error", "Invalid image format.\n Please upload .jpg, .jpeg, .png, .gif", "error");
}

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
}

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
}


function viewQuestion(question) {
    $('#problemName').text(question['name']);
    $('#createdBy').text(question['createdBy']);
    $('#type').text(question['type']);
    $('#viewDescription').text(question['description']);
    document.getElementById('problemImage').src = question['photoUrl'];

    $('#viewQuestionModal').modal('show');

}