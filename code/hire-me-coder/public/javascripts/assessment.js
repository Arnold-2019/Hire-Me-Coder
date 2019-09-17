$(document).ready(function () {
    getTest();

    $('#demoDate').datepicker({
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

// $('#sendAssessButton').click(() => {
//     console.log('SendAssessment button clicked');
//     $('#status').html('Sending emails ...');
// });

$('#previewButton').click(() => {
    console.log('hello');
    
    $.ajax({
        url: 'preview/',
        type: 'GET',
        dataType: 'text',
        success: (data) => {
            console.log('You received s ome data!', data);
            var mails = 'Send to: ' + $('#inputEmailBox').val();
            var tests = 'Assessment form name: ' + $('#inputAssBox').val();
            var due = 'Due date: ' + $('#inputDateBox').val();
            $('#mails').html(mails);
            $('#tests').html(tests);
            $('#due').html(due);
        }
    });
});

$('#demoDate').datepicker({
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: true
});

// $(document).ajaxError(() => {
//     $('#status').html('Error: unknown ajaxError!');
// });


$('#sendAssessmentForm').submit(function (event) {
    console.log('submittt!!');

    let emails = $('#emails').val();

    // email validation 
    // emailValidations(emails);

    // ajax call to do the email send
});

function emailValidations(emails) {
    let emailArr = emails.split(',');

    //for each loop

    //condition
    // if isValid! pop up an error message

}