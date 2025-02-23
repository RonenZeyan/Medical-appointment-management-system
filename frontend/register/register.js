document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Getting full name, email, phone, and password
    const full_name = document.getElementById("fullNameInput").value;
    const email = document.getElementById("emailInput").value.trim();
    const phone = document.getElementById("phoneInput").value;
    const password = document.getElementById("passwordInput").value.trim();
    const errorMessage = document.getElementById("register-error-message");
    const errorDiv = document.getElementById("register-error");

    // Ensures at least 5 characters of any type
    const minFullNameLengthRegex = /^.{5,}$/;

    // Matches a valid email format
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

    // Requires min 8 chars, 1 uppercase, 1 lowercase, 1 digit, and 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Ensures at least 7 characters of any type
    const minPhoneLengthRegex = /^.{7,}$/;

    // Full Name Regex Validation

    if (!minFullNameLengthRegex.test(full_name)) {
      document.getElementById("register-error").style.display = "block";
      document.getElementById("register-error-message").textContent =
        "שם המלא חייב להכיל לפחות 5 תווים.";
      return;
    }

    // Email Regex Validation
    if (!emailRegex.test(email)) {
      errorDiv.style.display = "block";
      errorMessage.textContent = "אימייל לא תקין. אנא הזן אימייל בפורמט תקין.";
      return;
    }

    // Phone Regex Validation
    if (!minPhoneLengthRegex.test(phone)) {
      errorDiv.style.display = "block";
      errorMessage.textContent = "מספר הטלפון חייב להכיל לפחות 7 תווים.";
      return;
    }
    // Password Regex Validation
    if (!passwordRegex.test(password)) {
      errorDiv.style.display = "block";
      errorMessage.textContent =
        "סיסמה חייבת להיות לפחות 8 תווים ולכלול אות גדולה, אות קטנה, מספר ותו מיוחד.";
      return;
    }

    // Data to send in the request body
    const registerData = {
      full_name,
      email,
      password,
      phone,
    };


    try {
      // Sending POST request for registration using fetch
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData), // Convert register data to JSON
      });

      // Check if response is OK
      if (!response.ok) {
        // If registration failed, show an error message
        errorDiv.style.display = "block";
        errorMessage.textContent = "אנא בדוק את הפרטים שוב.."; // Show registration failure message
      } else {
        // If registration is successful, you can redirect or show a success message
        window.location.href = "../login/login.html?success=true"; // Example: Redirect to login page after successful registration
      }
    } catch (error) {
      // Handle any errors that occur during the fetch or response parsing
      console.error(error);
      console.error(error.message);
      errorDiv.style.display = "block";
      errorMessage.textContent = "לא ניתן להתחבר לשרת. אנא נסה שנית"; // Network error message
    }
  });
