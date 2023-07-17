function validate(){
    var email=document.getElementById('email').value;
    var pass=document.getElementById('password').value;

    var res=email.match(/.+\..+@gmail\.com/);
    if(res==null){
        alert("Enter valid Email ID");
        return false;
    }
    else if(pass.length<8){
        alert("Password length should be more than 8");
        return false;
    }
    alert("Login Successfull")
    return true;
}


window.onscroll = function() {myFunction()};

var header = document.getElementById("navbar");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

function search() {
    let input = document.getElementById('search').value
    input=input.toLowerCase();
    let x = document.getElementsByClassName('col-sm-1 header1,col-sm-2 header2');
      
    for (i = 0; i < x.length; i++) { 
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display="none";
        }
        else {
            x[i].style.display="list-item";                 
        }
    }
}
