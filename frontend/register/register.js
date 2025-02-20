document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // getting username and password
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Data to send in the request body
    const registerData = {
      username,
      password,
      email,
    };

    // POST request for authentication
    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData), // Convert to JSON
    })
      .then((response) => response.json()) // Parse the JSON
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.token);
          window.location.href = "../login/login.html"; // Redirect to a login
        } else {
          // If register failed, show an error message
          document.getElementById("register-error").style.display = "block";
          document.getElementById("register-error-message").textContent =
            "אנא בדוק את הפרטים שוב..";
        }
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        document.getElementById("register-error").style.display = "block";
        document.getElementById("register-error-message").textContent =
          "אירעה שגיאה, אנא נסה שנית";
      });
  });
