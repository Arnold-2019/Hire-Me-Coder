$(document).ready(function () {
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            
        } else {
            console.log('not logged in');
            location.href='/login';
        }
    });
    
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
            let tests = data['tests'];
            
            tests.forEach(test => {
                testSelect.push(test['test_name']);
                $('#testSelect').append('<option value="' + test['test_name'] + '">' + test['test_name'] + '</option>');
            })          
        }
    }).done({

    });
}

function sendEmail(event) {
    console.log('submittt!!');
    var emails = $('#emailInput').val();

    if (timeValidation()) {
        swal({
            title: 'Invalid Time!',
            text: 'The expiry time should be later than the current time.',
            type: 'error'
        });
    } else {
        if (emailValidations(emails)) {
            // ajax call to do the email send
            $.ajax({
                url: 'send-assessment',
                type: 'POST',
                dataType: 'text',
                data: {
                        emails: $('#emailInput').val(),
                        testName: $('#testSelect').val(),
                        dueDate: $('#inputDateBox').val(),
                        dueTime: $('#inputTimeBox').val()
                      },
                success: (res) => {
                    if (res === 'Active') {
                        swal({
                            title: 'Failed!',
                            text: 'This user has in progressing assessment.',
                            type: 'error'
                        });
                    } else {
                        swal({
                            title: 'Successful',
                            text: 'Assessment Invation has been successfully sent.',
                            type: 'success'
                        }, function () {
                            $('#send-ass-form').get(0).reset();
                            $('#emailMessage').val("");
                            document.getElementById('emailMessage').disabled = true;
                            location.reload();
                        });
                    }
                }
            });
        } else {
            alert('Email address is invalid!');
        }
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

function timeValidation() {
    var flag = false;
    var due = $('#inputDateBox').val();
    var time = $('#inputTimeBox').val();
    dueTime = formatTime(due, time);
    var dueTime = new Date(dueTime);
    var currentTime = new Date();
    console.log('expiryTime: ' + dueTime);
    console.log('curTime: ' + currentTime);
    
    if (dueTime.getTime() < currentTime.getTime()) {
        flag = true;
    }

    console.log('The time have been set is expiried? ' + flag);
    return flag;
}

function formatTime(date, time) {
    dateArr = date.split('/')
    d = dateArr[0]
    m = dateArr[1]
    y = dateArr[2]

    timeArr = time.split(' ')
    time = timeArr[0]
    time_arr = time.split(':')
    hour = time_arr[0]
    minute = time_arr[1]
    switch (timeArr[1]) {
        case 'PM':
            hour = (Number(hour) + 12).toString(10)
    }
    time = hour + ':' + minute + ':00'

    month = ''
    switch (m) {
        case '01': month = 'January'; break;
        case '02': month = 'February'; break;
        case '03': month = 'March'; break;
        case '04': month = 'April'; break;
        case '05': month = 'May'; break;
        case '06': month = 'June'; break;
        case '07': month = 'July'; break;
        case '08': month = 'August'; break;
        case '09': month = 'September'; break;
        case '10': month = 'October'; break;
        case '11': month = 'November'; break;
        case '12': month = 'Desember'
    }

    dueTime = month + ' ' + d + ', ' + y + ' ' + time
    return dueTime
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
    'http://maptek.com/hiremecoder/candidateid/assessment-form \n\n' +
    'Best regards,\n' +
    'MapTek Team';
    
    $('#emailMessage').val(message);
    document.getElementById('emailMessage').disabled = false;
}

$('#inputTimeBox').datetimepicker({
    format: 'LT'
});

// reset forms
const reset = document.querySelector('#resetButton');
const sendAssForm = document.querySelector('#send-ass-form');
reset.addEventListener('click', (e) => {
    e.preventDefault();
    sendAssForm.reset();
});