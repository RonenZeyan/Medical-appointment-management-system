

//get widgets
const login_btn = document.getElementById("login-btn");
const register_btn = document.getElementById("register-btn");

//onload
window.addEventListener("load", () => {
    //authorized if admin access and not patient or dactor
    if (localStorage.getItem("role") === "admin") {
        window.location.href = "../dashboard/dashboard.html"
    }
    else if(localStorage.getItem("role") === "patient" || localStorage.getItem("role") === "doctor"){
        window.location.href = "../dashboard-user/dashboard-user.html"
    }
});

//set event listener for login button
login_btn.addEventListener("click",()=>{
    window.location.href="../login/login.html"
})


//set event listener for register button
register_btn.addEventListener("click",()=>{
    window.location.href="../register/register.html"
})