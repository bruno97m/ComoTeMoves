 function validate(){
       var pass = document.getElementById('password').value;
       var check = document.getElementById('checkpassword').value;

       if (!(pass===check)){
           alert("As passwords não coincidem!!!");
           }
    }
