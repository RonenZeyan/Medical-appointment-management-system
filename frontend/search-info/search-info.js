// Getting token
let token = localStorage.getItem("token");

// Container results hidden only shows when we have results
let divResults = document.getElementById("search-info-details");
divResults.style.display = "none";

// Show part of form when select doctor or clinic to search
const clinicFormPart = document.getElementById("clinic-form-part");
const doctorFormPart = document.getElementById("doctor-form-part");
clinicFormPart.style.display = "none";
doctorFormPart.style.display = "none";

// Buttons for doctor or clinic
const clinicButtonSort = document.getElementById("clinic-sort-button");
const doctorButtonSort = document.getElementById("doctor-sort-button");
clinicButtonSort.style.display = "none";
doctorButtonSort.style.display = "none";

// Selector Element
const selectElement = document.getElementById("search-info-form-options");

// Buttons for pagination
const clinicButtonContainer = document.getElementById(
  "clinic-list-buttons-container"
);
const clinicPrevButton = document.getElementById("clinic-list-previous-items");
const clinicNextButton = document.getElementById("clinic-list-next-items");
const doctorButtonContainer = document.getElementById(
  "doctor-list-buttons-container"
);
const doctorPrevButton = document.getElementById("doctor-list-previous-items");
const doctorNextButton = document.getElementById("doctor-list-next-items");

// Pagination data storage
const paginationData = {
  clinic: { data: [], currentPage: 1 },
  doctor: { data: [], currentPage: 1 },
};
const itemsPerPage = 5;

// Store sorting order (default is ascending)
const sortOrder = {
  clinics: "asc",
  doctors: "asc",
};

/**
 * Toggles sorting order and re-renders the list.
 * @param {string} type - The list type ("clinic" or "doctor").
 */
function toggleSort(type) {
  // Toggle sorting order between ascending and descending
  sortOrder[type] = sortOrder[type] === "asc" ? "desc" : "asc";

  // Update button text to reflect new sorting order
  document.getElementById(`${type}-sort-button`).textContent =
    sortOrder[type] === "asc" ? "מיין מ-א עד ת" : "מיין מ-ת עד א";

  // Re-render the list with updated sorting order
  renderList(type);
}

// render list with pagination
function renderList(type) {
  const listElement = document.getElementById(`${type}-list`);
  const prevButton = document.getElementById(`${type}-list-previous-items`);
  const nextButton = document.getElementById(`${type}-list-next-items`);
  const pageInfo = document.getElementById(`${type}-page-info`); // Get the page number span

  const { data, currentPage } = paginationData[type];


  // Sort data based on the selected order (A-Z or Z-A)
  data.sort((a, b) => {
    let nameA =
      type === "clinic" ? a.name.toLowerCase() : a.full_name.toLowerCase();
    let nameB =
      type === "clinic" ? b.name.toLowerCase() : b.full_name.toLowerCase();

    return sortOrder[type] === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Hide/Show pagination buttons based on number of pages
  if (totalPages <= 1) {
    type === "clinic"
      ? (clinicButtonContainer.style.display = "none")
      : (doctorButtonContainer.style.display = "none");
  } else {
    type === "clinic"
      ? (clinicButtonContainer.style.display = "block")
      : (doctorButtonContainer.style.display = "block");
  }

  // Update page number display
  pageInfo.textContent = `דף ${currentPage}   מתוך ${totalPages}`;

  listElement.textContent = ""; // Clear previous items

  // Calculate the starting index for the current page
  let start = (currentPage - 1) * itemsPerPage;

  // Calculate the ending index (exclusive) for slicing the data
  let end = start + itemsPerPage;

  // Extract only the items for the current page
  let paginatedData = data.slice(start, end);

  // Loop through the paginated data and create list items
  paginatedData.forEach((item) => {
    // Create a new list item element
    let listItem = document.createElement("li");
    listItem.id = "listItem";

    // Create a strong element for displaying the name
    let nameElement = document.createElement("strong");

    // Check if the list is for clinics or doctors and assign the correct name
    nameElement.textContent = type === "clinic" ? item.name : item.full_name;

    // Add an event listener to show details when the item is clicked
    listItem.onclick = () => {
      type === "clinic" ? showClinicDetails(item) : showUserDetails(item);
    };

    // Append the name element to the list item
    listItem.appendChild(nameElement);

    // If it's a clinic, add location details (city and region)
    if (type === "clinic") {
      let locationText = document.createElement("span");
      locationText.textContent = `  ${item.location.city}, ${item.location.region}`;
      listItem.appendChild(document.createElement("br"));
      listItem.appendChild(locationText);
    }

    // Append the fully constructed list item to the list
    listElement.appendChild(listItem);
  });

  // Disable buttons if at the beginning or end
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage * itemsPerPage >= data.length;
}

/**
 * Sets up pagination event listeners for a given list type (clinics or doctors).
 * This function assigns "Previous" and "Next" button functionality to control
 * pagination based on the current page.
 *
 * @param {string} type - The type of list (e.g., "clinics" or "doctors").
 */
function setupPagination(type) {
  // Get the Previous and Next buttons for the given list type
  const prevButton = document.getElementById(`${type}-list-previous-items`);
  const nextButton = document.getElementById(`${type}-list-next-items`);

  // Add click event for the "Previous" button
  prevButton.addEventListener("click", () => {
    // Ensure we don't go below the first page
    if (paginationData[type].currentPage > 1) {
      paginationData[type].currentPage--; // Move to the previous page
      renderList(type); // Re-render the list with new page data
    }
  });

  // Add click event for the "Next" button
  nextButton.addEventListener("click", () => {

    // Ensure we do not exceed the total number of pages available
    if (
      paginationData[type].currentPage * itemsPerPage <
      paginationData[type].data.length
    ) {
      paginationData[type].currentPage++; // Move to the next page
      renderList(type); // Re-render the list with new page data
    }
  });
}

// Function to set data dynamically for any list
function setData(type, data) {
  paginationData[type].data = data;
  paginationData[type].currentPage = 1;
  renderList(type);

  // Show or hide sort button based on whether there is data
  const sortButton = document.getElementById(`${type}-sort-button`);
  if (data.length > 0) {
    sortButton.style.display = "inline-block";
  } else {
    sortButton.style.display = "none";
  }
}

// Initialize pagination event listeners
setupPagination("clinic");
setupPagination("doctor");

// Show/Hide inputs based on selection
// When רופאים or מרפאות select it will show based them
document.addEventListener("DOMContentLoaded", function () {
  selectElement.addEventListener("change", function () {
    divResults.style.display = "none";

    if (selectElement.value == "מרפאות") {
      // If "Clinics" is selected
      clinicFormPart.style.display = "block"; // Show the clinic-specific form fields
      doctorFormPart.style.display = "none"; // Hide the doctor-specific form fields
      clinicButtonSort.style.display = "block";
      doctorButtonSort.style.display = "none";
    } else {
      // If "Doctors" is selected
      doctorFormPart.style.display = "block";
      clinicFormPart.style.display = "none";
      clinicButtonSort.style.display = "none";
      doctorButtonSort.style.display = "block";
    }
  });
});

// Getting info from db
async function searchInfo(event) {
  event.preventDefault();

  // First hide next/previous button
  doctorButtonContainer.style.display = "none";
  clinicButtonContainer.style.display = "none";

  // Get name (if its מרפאות then get name clinic else doctor) and topic to search
  let name;
  selectElement.value == "מרפאות"
    ? (name = document.getElementById("clinicName").value)
    : (name = document.getElementById("doctorName").value);
  let topic = document.getElementById("search-info-form-options").value;
  let region = document.getElementById("region-input-options").value; // Get region input value
  let medicalField = document.getElementById("medical-field").value; // Get region input value

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

  let response = null;

  // When we search for clinics
  if (topic === "מרפאות") {
    try {
      // Sending POST to find clinics by parameters
      if (name !== "" || region !== "") {
        // Name data send to search
        let searchData = { name, region };

        response = await fetch(`http://localhost:3000/api/clinic/find`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(searchData),
        });

        // when there is no clinics in db
        if (response.status === 404) {
          console.warn(" Clinic not found.");

          // Dont display results if there is none
          divResults.style.display = "none";

          // Show message
          message.style.display = "block";
          message.textContent = " לא נמצאה מרפאה בשם זה.";

          return;
        }
      } else {
        //  When we search clinic without parameters for finding all clinics
        response = await fetch(`http://localhost:3000/api/clinic/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const data = await response.json(); // Parse the JSON response

      if (data.length == 0) {
        // Dont display results if there is none
        divResults.style.display = "none";

        // Display message
        message.style.display = "block";
        message.textContent = "לא נמצאו מרפאות";
        return;
      }

      setData("clinic", data);

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
      // When we search doctors by parameters
      if (name !== "" || medicalField !== "") {
        let searchData = {
          full_name: name,
          medicalField,
        };

        response = await fetch(`http://localhost:3000/api/user/findDoctor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(searchData),
        });
      } else {
        // When we search all doctors
        response = await fetch(`http://localhost:3000/api/user/doctors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      //  Handle `404` separately
      // When we dont find doctors
      if (response.status === 404) {
        console.warn(" Clinic not found.");

        // Dont display results if there is none
        divResults.style.display = "none";

        // Display message
        message.style.display = "block";
        message.textContent = " לא נמצאה רופא בשם זה.";

        return;
      }

      const data = await response.json(); // Parse the JSON response


      if (data.length == 0) {
        // Dont display results if there is none
        divResults.style.display = "none";

        // Display message
        message.style.display = "block";
        message.textContent = "לא נמצאו רופאים";
        return;
      }

      setData("doctor", data);

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
      divResults.style.display = "none";

      message.style.display = "block";
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
