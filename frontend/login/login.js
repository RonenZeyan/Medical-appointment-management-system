document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // getting username and password
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Data to send in the request body
    const loginData = {
      username,
      password,
    };

    // POST request for authentication
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData), // Convert to JSON
    })
      .then((response) => response.json()) // Parse the JSON
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.token);
          window.location.href = "../dashboard/dashboard.html"; // Redirect to a dashboard
        } else {
          // If login failed, show an error message
          document.getElementById("login-error").style.display = "block";
          document.getElementById("login-error-message").textContent =
            "אנא בדוק את הפרטים שוב..";
        }
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        document.getElementById("login-error").style.display = "block";
        document.getElementById("login-error-message").textContent =
          "אירעה שגיאה, אנא נסה שנית";
      });
  });
