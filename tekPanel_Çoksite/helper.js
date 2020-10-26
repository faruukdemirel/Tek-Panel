var apiurl = 'https://btso-siteler-panel.com/api/';
var baseHref = 'https://btso-siteler-panel.com/';
var baseHref1='http://localhost:52330/wwwroot'


$(document).ready(function () {
    $.closeSwal = function() {
        setTimeout(function(){ swal.close(); }, 428);
        
    }
   $.cikisYap= function(){
        $('#cikisYap').on('click',function(){
            localStorage.clear();
            window.location="login.html";
        });
    
    }
    
    $.showSwal = function (title){
         
           Swal.fire({
             position: 'center',
             
             title: title,
             showConfirmButton: false,
             allowOutsideClick: false,
             allowEscapeKey: false
             
           });
           Swal.showLoading();
     }
     
     
 
     //setTimeout(function(){ alert("Hello"); }, 3000);
     
 
     $.getFormattedDate = function (date, callBack) {
         var d = new Date(date),
             month = '' + (d.getMonth() + 1),
             day = '' + d.getDate(),
             year = d.getFullYear();
 
         if (month.length < 2)
             month = '0' + month;
         if (day.length < 2)
             day = '0' + day;
 
         callBack([day, month, year].join('/'));
 
     }
 
 
     $.uploadFile = function (method, page, _data, callBack) {
         
         var settings = {
             "url": apiurl + page,
             "type": method,
             "processData": false,
             "contentType": false,
             "data": _data,
             "headers": {
                 "token": localStorage.getItem('token')
             }
         };
         $.ajax(settings).done(function (response) {
             console.log('donenData : ');
             console.dir(response);
             if (!response.status) {
                 if (response.message.indexOf("login olmalısınız") >= 0) {
                    
                         window.location.href = baseHref1 + "/login.html";
                     
                     
                 }
                 else
                     alert(response.message);
             }
             else{
                 
                 callBack(response);
             }
                 
         });
     };
 
     $("#inputRemove").click(function () {
         $('#postform').trigger("reset");
         $('#postform1').trigger("reset");
     });
     $("#yeniKayitBtn").click(function () {
         $('#postform').trigger("reset");
         $('#postform1').trigger("reset");
     });
 
     $.getData = function (method, page, _data, callBack) {
         
         var settings = {
             "url": apiurl + page,
             "method": method,
             "timeout": 0,
             "data": JSON.stringify(_data),
             "headers": {
                 "Content-Type": "application/json",
                 "token": localStorage.getItem('token')
             }
         };
         console.log(settings.headers.token);
         $.ajax(settings).done(function (response) {
             if (!response.status) {
                 if (response.message.indexOf("login olmalısınız") >= 0) {
                    
                         window.location.href = baseHref1 + "/login.html";
                    
                 }
                 else
                     alert(response.message);
             }
             else{
                 
                 callBack(response);
                 
             }
             
         });
         
        
     };

     $.getTinyCME=function(){
        tinymce.init({
            selector: '#detay_icerik,#detay_icerik1,#content_detail',
            plugins: 'image code',
            toolbar:  'undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image | code',
           
            image_title: true,
            
            automatic_uploads: true,
          
            file_picker_types: 'image',
            /* and here's our custom image picker*/
            file_picker_callback: function (cb, value, meta) {
              var input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*'); 
             
          
              input.onchange = function () {
                var file = this.files[0];
              
                var reader = new FileReader();
                reader.onload = function () {
                 
                  var id = 'blobid' + (new Date()).getTime();
                  var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                  var base64 = reader.result.split(',')[1];
                  var blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
               
                  cb(blobInfo.blobUri(), { title: file.name });
                
                };
                reader.readAsDataURL(file);
                
              };
             
          
              input.click();
            },
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          });
     }
     
 });
