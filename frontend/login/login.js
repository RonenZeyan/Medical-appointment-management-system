// Get the current URL and check for query parameters
const urlParams = new URLSearchParams(window.location.search);
const success = urlParams.get("success");

if (success === "true") {
  // Show the notification
  const notification = document.getElementById("success-notification");
  notification.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
      notification.style.animation = "fadeOut 0.5s ease-in-out";
      setTimeout(() => {
          notification.style.display = "none";
      }, 500);
  }, 3000);
}

//login form
document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // getting username and password
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const errorMessage = document.getElementById("login-error-message");

    // Data to send in the request body
    const loginData = {
      email,
      password,
    };

    try {
      // Sending POST request for authentication using fetch
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData), // Convert login data to JSON
      });

      // Check if response is OK
      if (!response.ok) {
        throw new Error("שגיאת התחברות, נא לבדוק את הפרטים."); // Throw an error if response is not OK
      }

      const data = await response.json(); // Parse the JSON response
      
      // Check if token exists in the response
      if (data.token) {
        localStorage.setItem("token", data.token); // Save token to localStorage
        localStorage.setItem("full_name", data.connectedUser.full_name); // Save full name
        localStorage.setItem("email", data.connectedUser.email); // Save email
        localStorage.setItem("id", data.connectedUser.id); // Save email
        localStorage.setItem("role", data.connectedUser.role); // Save email

        if(data.connectedUser.role === "admin"){
          window.location.href = "../dashboard/dashboard.html";
        }else{ //in case patient or doctor
          window.location.href = "../dashboard-user/dashboard-user.html"; // Redirect to user dashboard
        }

      } else {
        throw new Error("שגיאת התחברות, אנא נסה שנית .");
      }
    } catch (error) {
      // Display error message
      console.error(error);

      document.getElementById("login-error").style.display = "block";

      errorMessage.textContent = "שגיאת התחברות, אנא נסה שנית ";
    }
  });
