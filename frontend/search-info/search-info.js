// Getting token
let token = localStorage.getItem("token");

// Div results hidden only shows when we have results
let divResults = document.getElementById("search-info-details");
divResults.style.display = "none";

// Getting info from db
async function searchInfo(event) {
  event.preventDefault();

  // Get name and topic to search
  let name = document.getElementById("name").value;
  let topic = document.getElementById("search-info-form-options").value;

  // Div message
  let message = document.getElementById("response-message-contant");
  message.style.display = "none";

  // If there is no topic choosen it will notify the user to choose
  if (topic == "") {
    message.style.display = "block";
    divResults.style.display = "none";
    message.textContent = " אנא בחרו מה תרצו לחפש";
    return;
  }

  // Get the UL element for searches of clinics and doctors
  const clinicList = document.getElementById("clinic-list");
  const doctorList = document.getElementById("doctor-list");

  // First hide and reset
  clinicList.textContent = ""; //reset content
  clinicList.style.display = "none";
  doctorList.textContent = ""; //reset content
  doctorList.style.display = "none";

  // Name data send to search
  let searchData = {
    name,
  };

  let response = null;

  // When we search for clinics
  if (topic === "מרפאות") {
    try {
      // When we search clinic with name
      if (name !== "") {
        // Sending PUT request to update user details
        response = await fetch(
          `http://localhost:3000/api/clinic/find-by-name`,
          {
            method: "POST", // Updating user
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(searchData),
          }
        );

        // when there is no clinics in db
        if (response.status === 404) {
          console.warn(" Clinic not found.");

          divResults.style.display = "none";

          message.style.display = "block";
          message.textContent = " לא נמצאה מרפאה בשם זה.";

          return;
        }

        const data = await response.json(); // Parse the JSON response

        // Populate the clinic list dynamically
        let listItem = document.createElement("li");
        listItem.id = "listItem";

        // Create Clinic Name Element
        let nameElement = document.createElement("strong");
        nameElement.textContent = data.name;
        // Create Location Text
        let locationText = document.createElement("span");
        locationText.textContent = `  ${data.location.city}, ${data.location.region}`;

        // Add onclick function to open for more details for a clinic
        listItem.onclick = function () {
          showClinicDetails(data);
        };

        // Append elements to listItem
        listItem.appendChild(nameElement);
        listItem.appendChild(document.createElement("br")); // Line break
        listItem.appendChild(locationText);

        // Append listItem to the UL
        clinicList.appendChild(listItem);
        // clinicList.appendChild(hospitalIcon)
      } else {
        // When we search clinic without name for finding all clinics
        response = await fetch(`http://localhost:3000/api/clinic/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json(); // Parse the JSON response

        // Populate the clinic list dynamically
        data.forEach((clinic) => {
          let listItem = document.createElement("li");
          listItem.id = "listItem";

          // Create Clinic Name Element
          let nameElement = document.createElement("strong");
          nameElement.textContent = clinic.name;
          // Create Location Text
          let locationText = document.createElement("span");
          locationText.textContent = `  ${clinic.location.city}, ${clinic.location.region}`;

          listItem.onclick = function () {
            showClinicDetails(clinic);
          };

          // Append elements to listItem
          listItem.appendChild(nameElement);
          listItem.appendChild(document.createElement("br")); // Line break
          listItem.appendChild(locationText);

          // Append listItem to the UL
          clinicList.appendChild(listItem);
          // clinicList.appendChild(hospitalIcon)
        });
      }

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        throw new Error(errorData.message || "Failed to update user"); // Throw an error
      }

      // Show the results
      divResults.style.display = "block";
      clinicList.style.display = "block";
    } catch (error) {
      // Hide the results and show message
      message.style.display = "block";
      divResults.style.display = "none";

      message.textContent = "שגיאה בעדכון המשתמש, אנא נסה שנית";

      console.error("Error Finding:", error);
    }
  }
  // If we search for doctors
  else if (topic === "רופאים") {
    //Reset content and hide
    doctorList.textContent = "";
    doctorList.style.display = "none";

    try {
      // When we search clinic with name
      if (name !== "") {
        let searchData = {
          full_name: name,
        };

        // Sending PUT request to update user details
        response = await fetch(`http://localhost:3000/api/user/findDoctor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(searchData),
        });

        const user = await response.json(); // Parse the JSON response

        let listItem = document.createElement("li");
        listItem.id = "listItem";

        // Create user Name Element
        let nameElement = document.createElement("strong");
        nameElement.textContent = user.full_name;

        listItem.onclick = function () {
          showUserDetails(user);
        };

        // Append elements to listItem
        listItem.appendChild(nameElement);

        doctorList.appendChild(listItem);
        //  Handle `404` separately
        // When we dont find doctors
        if (response.status === 404) {
          console.warn(" Clinic not found.");

          divResults.style.display = "none";

          message.style.display = "block";
          message.textContent = " לא נמצאה רופא בשם זה.";

          return;
        }
      } else {
        // When we search doctors without name and finding all clinics
        response = await fetch(`http://localhost:3000/api/user/doctors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json(); // Parse the JSON response
        console.log(data)
        // Populate the clinic list dynamically
        data.forEach((user) => {
          let listItem = document.createElement("li");
          listItem.id = "listItem";

          // Create user Name Element
          let nameElement = document.createElement("strong");
          nameElement.textContent = user.full_name;

          listItem.onclick = function () {
            showUserDetails(user);
          };

          // Append elements to listItem
          listItem.appendChild(nameElement);

          doctorList.appendChild(listItem);
        });
      }

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        throw new Error(errorData.message || "Failed to update user"); // Throw an error
      }

      // Show the results
      divResults.style.display = "block";
      doctorList.style.display = "block";
    } catch (error) {
      // Hide the results and show message
      message.style.display = "block";
      divResults.style.display = "none";

      message.textContent = "שגיאה בעדכון המשתמש, אנא נסה שנית";

      console.error("Error Finding:", error);
    }
  }
}

// Modal for clinic results
function showClinicDetails(clinic) {
  const modal = document.getElementById("clinic-modal");
  const closeModal = document.querySelector(".close");

  let listItem = document.createElement("li");
  listItem.textContent = clinic.name;
  document.getElementById("modal-clinic-name").textContent = clinic.name;
  document.getElementById("modal-clinic-city").textContent =
    clinic.location.city;
  document.getElementById("modal-clinic-region").textContent =
    clinic.location.region;
  document.getElementById("modal-clinic-address").textContent =
    clinic.location.address;
  document.getElementById("modal-clinic-phone").textContent = clinic.phone;

  //  Get the container where we will add each opening hours line
  const hoursContainer = document.getElementById("modal-clinic-hours");
  hoursContainer.textContent = ""; // Clear previous content

  Object.entries(clinic.opening_hours).forEach(([day, time]) => {
    let timeLine = document.createElement("div"); // Create a new div for each day
    timeLine.textContent = `${day}: ${time.start} - ${time.end} (${time.status})`;
    timeLine.style.marginBottom = "5px";
    hoursContainer.appendChild(timeLine); // Add it to the container
  });

  //  Show the modal
  modal.style.display = "block";

  // Close the modal
  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  // Close the modal when clicked outside
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Modal for doctors results
function showUserDetails(doctor) {
  const modal = document.getElementById("doctor-modal");
  const closeModal = document.querySelector(".doctor-close");

  let listItem = document.createElement("li");
  listItem.textContent = doctor.name;
  document.getElementById("modal-doctor-full_name").textContent =
    doctor.full_name;
  document.getElementById("modal-doctor-phone").textContent = doctor.phone;
  document.getElementById("modal-doctor-email").textContent = doctor.email;
  document.getElementById("modal-doctor-medicalField").textContent =
    doctor.medicalField;

  //  Show the modal
  modal.style.display = "block";

  // Close the modal
  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  // Close the modal when clicked outside
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
