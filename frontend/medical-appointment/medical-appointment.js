window.onload = async function () {
  let selectElement = document.getElementById("medical-appointment-select");
  try {
    // Sending GET request for generate options medicalFields from db
    const response = await fetch("http://localhost:3000/api/medicalfield");
    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json(); // Parse error response
      throw new Error(errorData.message); // Throw an error if response is not OK
    }

    const data = await response.json(); // Parse the JSON response

    // Extracting only the names and pushing them to the medicalFields array
    const medicalFields = data.map((field) => field.name); // Extract names from each field


    // Loop through the array and create an <option> element for each name
    medicalFields.forEach((name) => {
      const option = document.createElement("option"); // Create a new option element
      option.value = name; // Set the value of the option to the name
      option.textContent = name; // Set the visible text of the option to the name
      selectElement.appendChild(option); // Append the option to the select element
    });
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error(error);
    document.getElementById("login-error").style.display = "block";
    document.getElementById("login-error-message").textContent =
      "אירעה שגיאה, אנא נסה שנית"; // Show error message for any failure
  }
};

//Search form
document
  .getElementById("medical-appointment-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Getting select to generate options from backend

    // Getting medicalField, clinic and doctor
    let medicalField = document.getElementById(
      "medical-appointment-select"
    ).value;
    let clinicName = document.getElementById(
      "medical-appointment-clinic-input"
    ).value;
    let doctorName = document.getElementById(
      "medical-appointment-doctor-input"
    ).value;

    // Data to send in the request body
    const searchData = {
      medicalField,
      clinicName,
      doctorName,
    };


    try {
      const response = await fetch("/api/appointments/available", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicalField, clinicName, doctorName }),
      });

      const data = await response.json();

      if (!data.length) {
        document.getElementById("appointment-results").innerHTML =
          "<p>לא נמצאו תורים זמינים</p>";
        return;
      }



    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error(error);
      document.getElementById("login-error").style.display = "block";
      document.getElementById("login-error-message").textContent =
        "אירעה שגיאה, אנא נסה שנית"; // Show error message for any failure
    }
  });
