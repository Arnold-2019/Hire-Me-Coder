$(document).ready(function () {
    getTest();
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (!firebaseUser) {
            console.log('not logged in');
            location.href = '/login';
        }
    });
});

questionIndex = 0;
var questions;
var userId;
var testId;

function getTest() {
    $.ajax({
        url: '/test/candidate/get-test',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            userId = data['userId'];
            testId = data['testId'];
            questions = data['questions'];
            console.log(userId);
            console.log(testId);
        }
    }).done(function () {
        populate();
    });
}

function populate() {
    let name = questions[questionIndex]['name'];
    let desc = questions[questionIndex]['description'];
    let answer = questions[questionIndex]['answer'];
    $('#questionName').text(name);
    $('#questionDescription').text(desc);
    $('#answer').val(answer);
}



function next() {
    checkQuestionAnwer();
    if (questionIndex < questions.length - 1) {
        document.getElementById('previousButton').disabled = false;
        if (questionIndex == questions.length - 2) {
            document.getElementById('nextButton').disabled = true;
        }
        questionIndex++;
        populate();
    }
}

function previous() {
    checkQuestionAnwer();
    if (questionIndex > 0) {
        document.getElementById('nextButton').disabled = false;
        console.log(questionIndex);
        if (questionIndex < 2) {
            document.getElementById('previousButton').disabled = true;
        }
        questionIndex--;
        populate();
    }
}

function checkQuestionAnwer() {
    let oldAnswer = questions[questionIndex]['answer'];
    let newAnswer = $('#answer').val();
    if (oldAnswer != newAnswer) {
        let questionName = $('#questionName').text();
        console.log(questionName);
        saveQuestionAnswer(questionName, newAnswer);
        getTest();
    }
}

function saveQuestionAnswer(questionName, answer) {
    $.ajax({
        url: '/test/candidate/question/save',
        type: 'POST',
        dataType: "json",
        data: {
            "userId": userId,
            "testId": testId,
            "questionName": questionName,
            "answer": answer
        },
        success: function (data) {

        }
    });
}

function submitTest() {
    checkQuestionAnwer();
    swal({
        title: 'Warning',
        text: 'You cannot change your answers after submiting!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: '/test/candidate/submit',
                type: 'POST',
                // dataType: "json",
                data: {
                    "userId": userId,
                    "testId": testId
                }, success: function (data) {
                    swal({
                        title: "Submitted",
                        text: "The test has been submitted.",
                        type: "success"
                    }, function () {
                        location.href = '/test/candidate'     
                    })
                }
            });
        }
    });
}

function saveDraft() {
    swal({
        title: 'Save',
        text: 'Are you sure you want to save and exit?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function (isConfirm) {
        if (isConfirm) {
            checkQuestionAnwer();
            swal({
                title: "Saved",
                text: "All data has been saved",
                type: "info"
            })
            location.href = '/test/candidate'
        }
    });
}
