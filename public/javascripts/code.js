var rooster=document.getElementById("rooster");
var loginbox=document.getElementsByClassName("loginbox")[0];

function logsequence(){
    rooster.style.animation= "rooster-main 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
    loginbox.style.display="block";
    loginbox.style.animation="loginbox 1.5s both";
}

var x=document.getElementById("login");
var y=document.getElementById("register");
var z=document.getElementById("btn");

function register(){
    x.style.left="-400px";
    y.style.left="50px";
    z.style.left="110px";
}

function login(){
    x.style.left="50px";
    y.style.left="450px";
    z.style.left="0px";
}



function loginbtn(){

var loginus=document.getElementById("loginuser").value;
var loginpa=document.getElementById("loginpass").value;


    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                location.href="/users/manager/dash.html";
            }
            else if(this.readyState == 4 && this.status == 201) {
                location.href="/users/staff_dash.html";
            }
                else if(this.readyState == 4 && this.status == 401){
                alert("Login Failed! Try Again");
            }
        };
        xhttp.open("POST","/login", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({user:loginus, pass:loginpa}));
}


function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 40,
    'height': 40,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSignIn,
    'onfailure': onFailure
  });
}

function onFailure(error) {
  console.log(error);
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'tokensignin');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            location.href="/users/manager/dash.html";
        }
        else if(this.readyState == 4 && this.status == 201) {
            location.href="/users/staff_dash.html";
        }
            else if(this.readyState == 4 && this.status == 401){
            alert("Login Failed! Try Again");
        }
    };
    xhr.send(JSON.stringify({'idtoken':id_token}));
}




function regbtn(){

var fname=document.getElementById("fname-reg").value;
var lname=document.getElementById("lname-reg").value;
var email=document.getElementById("mail-reg").value;
var phone=document.getElementById("phone-reg").value;
var pass=document.getElementById("pass-reg").value;


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("Registration Successful! Log in to continue.");
        }
    };

    xhttp.open("POST","/register", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({fname:fname, lname:lname, email:email, phone:phone, pass:pass}));
}


//                              SHIFTS
function addshift(){
    let table=document.getElementById("shift");
    let first=document.getElementById("fname").value;
    let last=document.getElementById("lname").value;
    let position=document.getElementById("pos").value;
    let start=document.getElementById("start").value;
    let end=document.getElementById("end").value;
    let desc=document.getElementById("desc").value;

    let row = document.createElement("tr");

    cell = document.createElement("td");
    cell.innerText = first+" "+last;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = start+" to "+end;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = position;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = desc;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText ="testing";
    row.appendChild(cell);

    table.appendChild(row);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            alert("Shift added successfully!");
        }
    };

    xhttp.open("POST","/users/manager/shift/new", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({first: first, last: last, position: position, start: start, end: end, desc: desc}));
}

function loadshifts(){

    gapi.load('auth2', function(){
        gapi.auth2.init();
    });

    let table=document.getElementById("shift");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){

            for (rows in JSON.parse(this.responseText)){
                let row = document.createElement("tr");
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].fname+" "+JSON.parse(this.responseText)[rows].lname;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].tstart+" to "+JSON.parse(this.responseText)[rows].tend;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].roles;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].descript;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = "testing";
                row.appendChild(cell);
                table.appendChild(row);
            }
        }
    };
        xhttp.open("GET","/users/loadshifts", true);
        xhttp.send();
}



//                      STAFF
function addstaff(){
    let table=document.getElementById("staff");
    let first=document.getElementById("fname").value;
    let last=document.getElementById("lname").value;
    let position=document.getElementById("pos").value;
    let mail=document.getElementById("mail").value;
    let phone=document.getElementById("phone").value;


    let row = document.createElement("tr");

    cell = document.createElement("td");
    cell.innerText = first+" "+last;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = mail;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = phone;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = position;
    row.appendChild(cell);

    table.appendChild(row);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            alert("Staff member added.");
        }
    };

    xhttp.open("POST","/users/manager/staff/new", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({first: first, last: last, position: position, mail:mail, phone: phone}));
}

function loadstaff(){

     gapi.load('auth2', function(){
        gapi.auth2.init();
    });

    let table=document.getElementById("staff");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){

            for (rows in JSON.parse(this.responseText)){
                let row = document.createElement("tr");
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].fname+" "+JSON.parse(this.responseText)[rows].lname;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].email;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].phone;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].roles;
                row.appendChild(cell);
                table.appendChild(row);
            }
        }
    };
        xhttp.open("GET","/users/manager/loadstaff", true);
        xhttp.send();
}



//                       ROLES
function addrole(){
    let table=document.getElementById("role");
    let first=document.getElementById("fname").value;
    let last=document.getElementById("lname").value;
    let position=document.getElementById("pos").value;


    let row = document.createElement("tr");

    cell = document.createElement("td");
    cell.innerText = first+" "+last;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = position;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = "unconfirmed";
    row.appendChild(cell);

    table.appendChild(row);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            alert("Role assigned.");
        }
    };

    xhttp.open("POST","/users/manager/role/new", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({first: first, last: last, position: position}));
}

function loadroles(){

     gapi.load('auth2', function(){
        gapi.auth2.init();
    });

    let table=document.getElementById("role");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){

            for (rows in JSON.parse(this.responseText)){
                let row = document.createElement("tr");
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].fname+" "+JSON.parse(this.responseText)[rows].lname;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = JSON.parse(this.responseText)[rows].roles;
                row.appendChild(cell);
                cell = document.createElement("td");
                cell.innerText = "unconfirmed";
                row.appendChild(cell);
                table.appendChild(row);
            }
        }
    };
    xhttp.open("GET", "/users/manager/loadroles", true);
    xhttp.send();
}

//                              PROFILE

function updateprof(){

    let fname=document.getElementById("fname").value;
    let lname=document.getElementById("lname").value;
    let email=document.getElementById("email").value;
    let phone=document.getElementById("phone").value;
    let pass=document.getElementById("pass").value;


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            alert("Profile updated successfully!");
            }
        };

    xhttp.open("POST","/users/updateprof", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({fname:fname, lname:lname, email:email, phone:phone, pass:pass}));

}

function loadprofile(){

     gapi.load('auth2', function(){
        gapi.auth2.init();
    });

    let user_fname=document.getElementById("fname");
    let user_lname=document.getElementById("lname");
    let user_email=document.getElementById("email");
    let user_phone=document.getElementById("phone");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){

            user_fname.placeholder = JSON.parse(this.responseText)[0].fname;
            user_lname.placeholder = JSON.parse(this.responseText)[0].lname;
            user_email.placeholder = JSON.parse(this.responseText)[0].email;
            user_phone.placeholder = JSON.parse(this.responseText)[0].phone;

        }
    };
        xhttp.open("GET", "/users/loadprofile", true);
        xhttp.send();
}


function logout(){

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/logout", true);
    xhttp.send();
    location.href="/index.html";
}