$(document).ready(function () {
    getTest();

    $('#inputDateBox').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
    });

});


function getTest() {
    let testSelect = [];
    $.ajax({
        url: '/assessment/test/view',
        type: 'GET',
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data['tests']);
            
            let tests = data['tests'];
            
            tests.forEach(test => {
                console.log(test['test_name']);
                testSelect.push(test['test_name']);
                $('#testSelect').append('<option value="' + test['test_name'] + '">' + test['test_name'] + '</option>');
            })          
        }
    }).done({

    });
}

// $('#sendAssessButton').click(function (event) {
//     console.log('submittt!!');
//     var emails = $('#emailInput').val();

//     // ajax call to do the email send
//     if (emailValidations(emails)) {
//         // ajax call to do the email send
//         $('#status').html('Sending emails ...');
//         $.ajax({
//             url: 'send-assessment',
//             type: 'POST',
//             data: {
//                     emails: $('#emailInput').val(),
//                     testName: $('#testSelect').val(),
//                     dueDate: $('#inputDateBox').val(),
//                     dueTime: $('#inputTimeBox').val()
//                   },
//             success: (data) => {
//                 console.log('You received some data in ajaxPOST: ', data);
//                 $('#status').html('Status: ' + data);
//                 if(data){
//                     console.log(data + 'mails sent.');
//                     $('#status').html(data + 'mails sent.');
//                     // alert('Failed! Assessment did NOT send.');
//                 } else {
//                     console.log('Send successfully!');
//                     alert('Failed! Assessment did NOT send.');
//                     // alert('Assessment sent successfully!');
//                 }
//             }
//         });
//     } else {
//         // pop up error message
//         alert('Email address is invalid!')
//     }
// });

function sendEmail(event) {
    // event.preventDefault();
    console.log('submittt!!');
    var emails = $('#emailInput').val();

    // ajax call to do the email send
    if (emailValidations(emails)) {
        // ajax call to do the email send
        $('#status').html('Sending emails ...');
        $.ajax({
            url: 'send-assessment',
            type: 'POST',
            data: {
                    emails: $('#emailInput').val(),
                    testName: $('#testSelect').val(),
                    dueDate: $('#inputDateBox').val(),
                    dueTime: $('#inputTimeBox').val()
                  },
            success: (data) => {
                // alert('Emails sent successfully!');
                // $('#status').html('Mails sent: ' + data);
                swal({
                    title: 'Successful',
                    message: 'Assessment Invation has been successfully sent.',
                    type: 'success'
                }, function () {
                    $('#sendAssessmentForm').get(0).reset();
                    $('#emailMessage').val("");
                    document.getElementById('emailMessage').disabled = true;
                    location.reload();
                });
            }
        });
        // $('#status').html('Emails sent successfully!');
    } else {
        // pop up error message
        alert('Email address is invalid!');
    }
}

function emailValidations(emails) {
    let emailArr = emails.split(',');
    for (var i = 0; i < emailArr.length; i++) {
        if (emailArr[0].search('@') == -1) {
            return false;
        }
    }
    return true;
}

function displayEmail() {
    let emailAddress = $('#emailInput').val();
    let email = emailAddress.split(',');
    let testName = $('#testSelect').val();
    let date = $('#inputDateBox').val();
    let time = $('#inputTimeBox').val();
    let message = 
    'Test name: ' + testName + '\n' +
    'Send to: ' + emailAddress + '\n\n' +
    
    'Welcome,\n' + 
    'We have kindly created an account for you, and with this account ' +
    'you can access your assessment form.\n\n' +
    'Please submit your solutions by the DUE DATE: ' + 
    '  ' + date + '  ' + time + '\n\n' +
    'Your Account name is your email address and the default initial password ' +
    'is attached below. Really recommend to update your Password after logging in.\n\n' +
    'User name: ' + email[0] + '\n' +
    'Password: ********* \n\n' +
    'Please click the link below to login to your account.\n' +
    '\" http://maptek.com/hiremecoder/candidateid/assessment-form \"\n\n' +
    'Best regards,\n' +
    'MapTek Team';
    
    $('#emailMessage').val(message);
    document.getElementById('emailMessage').disabled = false;
}

$('#inputTimeBox').datetimepicker({
    format: 'LT'
});