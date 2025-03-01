

//get widgets
const login_btn = document.getElementById("login-btn");
const register_btn = document.getElementById("register-btn");

//set event listener for login button
login_btn.addEventListener("click",()=>{
    window.location.href="../login/login.html"
})


//set event listener for register button
register_btn.addEventListener("click",()=>{
    window.location.href="../register/register.html"
})