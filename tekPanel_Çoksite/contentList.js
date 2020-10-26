$(document).ready(function(){
        getContentList();
        $.getTinyCME();
        getSiteName();
        getCategoryName();
        getContent();
       
        

        $('#addContent').on('click',function(){
            $('#modalContentAdd').modal('show');
            removeInput();
       
        });
        $('#myFile').change(function () {
            file = $('#myFile').prop('files')[0];
            console.dir(file);
            
        });
        
          
        
        if (window.File && window.FileList && window.FileReader) {
            
            var filesInput = document.getElementById("files");
            filesInput.addEventListener("change", function(event) {
              var files = event.target.files; //FileList object
              var output = document.getElementById("result1");
              for (var i = 0; i < files.length; i++) {
                var file = files[i];
                //Only pics
                if (!file.type.match('image'))
                  continue;
                var picReader = new FileReader();
                picReader.addEventListener("load", function(event) {
                  var picFile = event.target;
                  var div = document.createElement("div");
                  div.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" +
                    "title='" + picFile.name + "'/>";
                  output.insertBefore(div, null);
                });
                //Read the image
                picReader.readAsDataURL(file);
                console.log(file);
                image_arr.push(file);
                
               
              }
            });
            
          } else {
            console.log("Your browser does not support File API");
          }
       
    
    $('#icerikEkle').on('click',function(){
        addIcerik();
       
    //   console.log(filesImage);
      
      
      });
      $.cikisYap();
});
// var siteler=new Array();
// var kategori=new Array();
// var icerikTip=new Array();

var detay ;
var formData = new FormData(); 
var filesImage=[];
var image_arr=[];
var file;
var file2;

function removeInput(){
   $('#contentSubject').val('');
    $('#contentCategory').val('');
    $('#contentType').val('');
    tinymce.get("content_detail").setContent("");;
    $('#myFile').val('');
    $('#files').val('');
    getSiteName();
    $('#result1').val('');
    $('#result1 div').val('');

}


function addIcerik(){
    var baslik=$('#contentSubject').val();
    var kategori=$('#contentCategory').val();
    var icerik_tip=$('#contentType').val();
     var detay = tinymce.get("content_detail").getContent({ format: "file" });;
    
    var formData = new FormData(); 
    var siteid_arr=[];

    $('input[type=checkbox]').each(function () {
        if (this.checked) {
            siteid_arr.push($(this).val());
           
        }
    });
    
    var index = 0;
    $.each($(siteid_arr), function () {         
            formData.append('site_id', Number(siteid_arr[index]));
            index++;
            
        });
        if(siteid_arr.length == 0){
            Swal.fire({
                icon: 'error',
                title: 'Site Seçilmedi',
              
              })
        }       
        formData.append('content_type_id',Number(icerik_tip) );
        formData.append('is_publish',true);

        
        formData.append('subject', baslik);
        formData.append('detail', detay);
        formData.append('category_id', Number(kategori));

     if(document.getElementById("myFile").files.length == 0 && image_arr.length == 0 ){
        
        
        console.log(formData);
    $.showSwal("Yükleniyor");
    $.uploadFile(
        'POST',
        'ContentFile/addspec',
        formData,
        function (response) {            
            if (response.status) {  
                removeInput();
                $('#modalContentAdd').modal('hide');                     
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'İçerik Eklendi',
                    showConfirmButton: false,
                    timer: 2000
                  })
                  setTimeout(function(){
                    window.location="contentList.html";

                 },500); 
                 
              
            };
        }
    );
  
    
   }   
   if(document.getElementById("myFile").files.length != 0 && image_arr.length == 0){
       formData.append('MImage',file,file.name);
       console.log(file.name);
       $.uploadFile(
        'POST',
        'ContentFile/addspec',
        formData,
        function (response) {            
            if (response.status) {
                removeInput();
                $('#modalContentAdd').modal('hide');      
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'İçerik Eklendi',
                    showConfirmButton: false,
                    timer: 2000
                  })
                 
                 setTimeout(function(){
                    window.location="contentList.html";

                 },500); 

              
            };
        }
    );
   }
   if(image_arr.length != 0 && document.getElementById("myFile").files.length == 0){      

    console.log( image_arr);
    var i=0;
    for(i;i<image_arr.length;i++){
        formData.append('Image',image_arr[i]);
    }
    $.showSwal("Yükleniyor");
    $.uploadFile(
        'POST',
        'ContentFile/addspec',
        formData,
        function (response) {            
            if (response.status) {
                removeInput();
                $('#modalContentAdd').modal('hide');                   
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'İçerik Eklendi',
                    showConfirmButton: false,
                    timer: 2000
                  })
                  setTimeout(function(){
                      window.location="contentList.html";
                   
                 },500); 
              
            };
        }
    );

   }
   if(image_arr.length != 0 && document.getElementById("myFile").files.length != 0){  

    formData.append('MImage',file,file.name);
    console.log( image_arr);
    var i=0;
    for(i;i<image_arr.length;i++){
        formData.append('Image',image_arr[i]);
    }
    $.showSwal("Yükleniyor");
    $.uploadFile(
        'POST',
        'ContentFile/addspec',
        formData,
        function (response) { 
            removeInput();
            $('#modalContentAdd').modal('hide');              
            if (response.status) {             
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'İçerik Eklendi',
                    showConfirmButton: false,
                    timer: 2000
                  })
                  setTimeout(function(){
                    window.location="contentList.html";

                 },500); 
              
            };
        }
    );

   }
}

function getContentList(){
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Content/Getlist',
        {},
        function (response) {            
            if (response.status) {
               
                $('#contentListBody').html("");
                var rows="";
                response.data.forEach(function (data,index) {
                    rows += `
                    <tr>
                    <td>${index+1}</td>
                    <td>${data.subject}</td> 
                    <td >${data.type_name}</td> 
                    <td >${data.category_name}</td> 
                    <td >${data.site_name}(${data.site_url})</td> 


                    <td><button title="Düzenle" style="margin-right:5px;" onclick="getIcerikDetail(${data.id})" class="btn btn-outline-primary standard-button btn-color-primary"> <i class="fas fas fa-folder"></i></button>
                    <button title="Sil" style="margin-right:5px;" onclick="icerikDelete(${data.id})" class="btn btn-outline-warning standard-button btn-color-warning"> <i class="fas fa-trash-alt"></i></button>                
                    </td>
                </tr>
                    `;

                });            
                $('#contentListBody').html(rows);
                $.closeSwal();  
            };
        }
    );
}
function getIcerikDetail(id_){
    $.showSwal("Yükleniyor");
    $('#siteName').val('');   
    $('#modalContent').modal('show');
    console.log(id_);
    var data={
        "id":id_,
    }
   
    $.getData(
        'POST',
        'Content/Getlist',
        data,
        function (response) {            
            if (response.status) { 
                response.data.forEach(function (data,index) {     
                    $('#kategori').val(data.category_id);
                    $('#icerikTip').val(data.content_type_id);
                    $('#eklencekBaslik').val(data.subject);
                    $('#siteName').val(data.site_id);                   
                    tinymce.get("detay_icerik").setContent(data.detail);
                    $.closeSwal();            
            });

              
            };
        }
    );
    $('#updateBtn').on('click',function(){
        $.showSwal("Yükleniyor");
        var icerik_tip_id= $('#icerikTip').val();
        var siteId=$('#siteName').val();  
        var kategoriId= $('#kategori').val();
        var baslik= $('#eklencekBaslik').val();
        var detail=tinymce.get("detay_icerik").getContent({ format: "file" });;
        var data_={
            "id":Number(id_),
            "content_type_id":Number(icerik_tip_id),
            "site_id":Number(siteId),
            "category_id":Number(kategoriId),
            "subject":baslik,
            "detail":detail,
            "is_publish":true
        }
        $.getData(
            'POST',
            'Content/update',
            data_,
            function (response) {            
                if (response.status) { 
                                         
                      Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'İçerik Güncellendi',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      $('#modalContent').modal('hide');
                      location.reload();

                     
                  
                };
            }
        );


    });

}

function getSiteName(){ 
    $.showSwal("Yükleniyor");       
        $.getData(
            'POST',
            'Site/Getlist',
            {},
            function (response) { 
               
                $('#contentSiteNames').html("");
                $('#siteName').html("");

                var rows="  ";         
                var selectBox=" <option value='0' disabled selected>Kategori Seçiniz</option> ";         

                if (response.status) { 
                    response.data.forEach(function (data,index) {                  
                    rows += `<tr><td>
                    <div class="custom-control custom-checkbox">
                    <input type="checkbox" name="siteCheckBox" class="custom-control-input" id="${data.id}" value="${data.id}">
                    <label class="custom-control-label" for="${data.id}">${data.site_name}-->(${data.site_url})</label>
                </div>
               </td></tr>        
                `; 
                selectBox +=` <option value="${data.id}">${data.site_name}-->(${data.site_url})</option>`;               
    
                }); 
                $('#contentSiteNames').html(rows);
                $('#siteName').html(selectBox);

               
                $.closeSwal();   
                };
            }
        );    
    
    }
    function getCategoryName(){
       
        $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'Category/Getlist',
            {},
            function (response) {            
                if (response.status) {   
                    $('#kategori').html("");
                    $('#contentCategory').html("");
                var rows="<option value='0' disabled selected>Kategori Seçiniz</option>";              
                    response.data.forEach(function (data,index) {                       
                        rows += `
                    <option value="${data.id}">${data.category_name}</option>  
                    `;
                        
                    }); 
                    $('#kategori').html(rows); 
                    $('#contentCategory').html(rows);

                    $.closeSwal();               
                };
            }
        );
    }
    function getContent(){
        $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'ContentType/Getlist',
            {},
            function (response) { 
                $('#icerikTip').html("");
                $('#contentType').html("");
                var rows="<option value='0' disabled selected>İçerik Tip Seçiniz</option>";           
                if (response.status) {                  
                    response.data.forEach(function (data,index) {                       
                        rows += `
                        <option value="${data.id}">${data.type_name}</option>  
                        `;
    
                    }); 
                     
                    $('#contentType').html(rows);
                    $('#icerikTip').html(rows);
                    $.closeSwal(); 

                };
            }
        );
    }
    function icerikDelete(id_){
        var _data={
            "id":Number(id_)
        }
        Swal.fire({
            title: 'İçerik Silinsin mi?',       
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet',
            cancelButtonText:'Hayır'
          }).then((result) => {
            if (result.isConfirmed) {          
                $.getData(
                    'POST',
                    'Content/delete',
                    _data,
                    function (response) {
                        if (response.status) {                         
                          Swal.fire("Başarılı", "İçerik Silindi", "success");                  
                            location.reload();
                            
                        };
                    }
                );
               
             
            }
          })
    }