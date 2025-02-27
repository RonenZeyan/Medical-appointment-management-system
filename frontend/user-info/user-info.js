// Getting token from local storage
let token = localStorage.getItem("token");

// Getting details from DB, info of user on onload
async function loadDetails() {
  let id = localStorage.getItem("id");
  let email = document.getElementById("displayEmail");
  let full_name = document.getElementById("displayFullName");
  let phone = document.getElementById("displayPhone");

  try {
    // Sending POST request to get user details
    const response = await fetch(`http://localhost:3000/api/user/userInfo/${id}`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // If authentication is needed
      },
      body: JSON.stringify({ id: id }),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json(); // Parse error response
      throw new Error(errorData.message || "Failed to find user"); // Throw an error
    }

    const data = await response.json(); // Parse the JSON response

    // Passing data for it to show
    email.textContent = data.email;
    full_name.textContent = data.full_name;
    phone.textContent = data.phone;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

// When use update there info
async function saveUserInfo() {
  // Getting values email, full name, phone
  let email = document.getElementById("email").value;
  let full_name = document.getElementById("full_name").value;
  let phone = document.getElementById("phone").value;

  // Getting form
  let form = document.getElementById("user-info-form") 

  // Ensures at least 5 characters of any type
  const minFullNameLengthRegex = /^.{5,}$/;

  // Matches a valid email format
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

  // Ensures at least 7 characters of any type
  const minPhoneLengthRegex = /^.{7,}$/;

  // Error message is hidden first
  let message = document.getElementById("response-message-contant");
  message.style.display = "none";

  // Notify user he need at least one value for to update
  if (email === "" || full_name === "" || phone === "") {
    message.style.display = "block";

    message.textContent = "לפחות אחד הפרטים חייב לעדכן";
    return;
  }

  // FullName Regex Validation
  if (!minFullNameLengthRegex.test(full_name)) {
    message.style.display = "block";
    message.textContent = "שם המלא חייב להכיל לפחות 5 תווים.";
    return;
  }

  // Email Regex Validation
  if (!emailRegex.test(email)) {
    message.style.display = "block";
    message.textContent = "אימייל לא תקין. אנא הזן אימייל בפורמט תקין.";
    return;
  }

  // Phone Regex Validation
  if (!minPhoneLengthRegex.test(phone)) {
    message.style.display = "block";
    message.textContent = "מספר הטלפון חייב להכיל לפחות 7 תווים.";
    return;
  }

  // Data to send
  let userData = {
    email,
    full_name,
    phone,
  };

  // Getting id to send from local storage
  let id = localStorage.getItem("id");

  try {
    // Sending PUT request to update user details
    const response = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: "PUT", // Updating user
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json(); // Parse error response
      throw new Error(errorData.message || "Failed to update user"); // Throw an error
    }

    // Show seccuss message 
    message.style.display = "block";
    message.textContent = "התעדכן בהצלחה";
    form.reset()

    // After seccussfuly update, update also in UI to show
    loadDetails();
  } catch (error) {
    message.style.display = "block";
    // Show error message 
    message.textContent = "שגיאה בעדכון המשתמש, אנא נסה שנית";

    console.error("Error updating user:", error);
  }
}

loadDetails();
