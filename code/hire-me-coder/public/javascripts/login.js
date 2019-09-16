$("#loginForm").submit(function (events) {
    event.preventDefault();
    $.ajax({
        url: '/login/validate',
        method: 'GET',
        success: function (data) {
            
        }, error: function (e) {
            
        }
    }).done(function (params) {
        
    })


})