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

$('#previewButton').click(() => {
    console.log('hello');
    
    $.ajax({
        url: 'preview/',
        type: 'GET',
        dataType: 'text',
        success: (data) => {
            console.log('You received s ome data!', data);
            var mails = $('#inputEmailBox').val();
            var tests = $('#inputAssBox').val();
            var due = $('#inputDateBox').val();
            var time = $('#inputTimeBox').val();
            var p1 = 'Wellcome,';
            var p2 = 'We have kindly created an account for you, and with this account ' +
                     'you can access your assessment form.';
            var p3 = 'Please submit your solutions by the ' + due + time;
            var p4 = 'Your Account name is your email address and the defult initial password ' +
                     'is attached below. Realy recommend to update your Password after logging in.';
            var p5 = 'User name: ' + mails;
            var p6 = 'Password: hjhHI23jJK';
            var p7 = 'Please click the link below to login to your account.';
            var p8 = 'http://the.link.to.login.maptek';
            var p9 = 'Best regards,';
            var p10= 'MapTek Team';

            $('#mails').html('Send to: ' + mails);
            $('#tests').html('Test name: ' + tests);
            $('#due').html('Due date: ' + due);
            $('#template').html('Email template: ');
            $('#p1').html(p1);
            $('#p2').html(p2);
            $('#p3').html(p3);
            $('#p4').html(p4);
            $('#p5').html(p5);
            $('#p6').html(p6);
            $('#p7').html(p7);
            $('#p8').html(p8);
            $('#p9').html(p9);
            $('#p10').html(p10);
        }
    });
});

$('#sendAssessButton').click(function (event) {
    console.log('submittt!!');
    var emails = $('#inputEmailBox').val();

    // email validation 
    // emailValidations(emails);

    // ajax call to do the email send
    if (emailValidations(emails)) {
        // ajax call to do the email send
        $('#status').html('Sending emails ...');
        $.ajax({
            url: 'send-assessment',
            type: 'POST',
            data: {
                    emails: $('#inputEmailBox').val(),
                    dueDate: $('#inputDateBox').val(),
                    dueTime: $('#inputTimeBox').val(),
                    testName: $('#inputAssBox').val()
                  },
            success: (data) => {
                console.log('You received some data in ajaxPOST: ', data);
                $('#status').html('Status: ' + data);
                if(data){
                    console.log(data + 'mails sent.');
                    $('#status').html(data + 'mails sent.');
                    // alert('Failed! Assessment did NOT send.');
                } else {
                    console.log('Send successfully!');
                    alert('Failed! Assessment did NOT send.');
                    // alert('Assessment sent successfully!');
                }
            }
        });
    } else {
        // pop up error message
        alert('Email address is invalid!')
    }
});

function emailValidations(emails) {
    let emailArr = emails.split(',');
    for (var i = 0; i < emailArr.length; i++) {
        if (emailArr[0].search('@') == -1) {
            return false;
        }
    }
    return true;
}