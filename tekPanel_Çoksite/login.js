

$(document).ready(function(){
    
    $('#girisYapBtn').on('click',function(){
        var userName=$('#username').val();
        var pass=$('#userpassword').val();
        var data = {
            'email': userName,
            'password': pass
        }
    
        $.getData(
            'POST',
            'User/login',
            data,
            function (response) {            
                localStorage.setItem("token", response.data.token);
                window.location="index.html";
                console.log("Giriş Başarılı");
            }
        );
    });


});


