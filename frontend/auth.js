
window.addEventListener("load", () => {

    setTimeout(() => {
        let token = localStorage.getItem("token"); 
        let full_name = localStorage.getItem("full_name"); 
        let email = localStorage.getItem("email"); 
        let user_id = localStorage.getItem("id");

        if (!token || !full_name || !email || !user_id) {
            console.log("No authentication found! Redirecting to login...");
            localStorage.clear();
            window.location.href = "/frontend/login/login.html";
        } else {
        }
    }, 0);
})

