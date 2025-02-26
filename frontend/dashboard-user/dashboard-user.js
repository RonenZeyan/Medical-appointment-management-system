window.onload = async function () {

  let box_bottom_span = document.getElementById(
    "dashboard-user-appointment-exist"
  );

  let box_bottom_span_infoom = document.getElementById(
    "dashboard-user-appointment-inform"
  );

  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("id");

  // try {
  //   // Sending GET request to get existing appointments
  //   const response = await fetch(
  //     `http://localhost:3000/api/appointment/existing-appointment/${userId}`,
  //     {
  //       method: "GET", // GET method
  //       headers: {
  //         "Content-Type": "application/json", // Content-Type header
  //         // Add Authorization token if required
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   // Check if response is OK
  //   if (!response.ok) {
  //     const errorData = await response.json(); // Parse error response
  //     throw new Error(errorData.message); // Throw an error if response is not OK
  //   }

  //   const data = await response.json(); // Parse the JSON response

  //   if (!data) {
  //     date = new Date(data.appointment_date);

  //     // Format to trim the date using 'en-IL' locale (English in Israel)
  //     const dateOnly = new Intl.DateTimeFormat("en-IL").format(date);

  //     const span = document.createElement("span");
  //     box_bottom_span.appendChild(span);

  //     box_bottom_span_infoom.textContent = `לצפייה או ביטול לחץ כאן`;
  //     span.textContent = "יש לך תור ב - ";

  //     // Create another span for the bold date
  //     const boldSpan = document.createElement("span");
  //     boldSpan.style.fontWeight = "bold";
  //     boldSpan.textContent = dateOnly; // Set the date

  //     // Append the boldSpan to the main span
  //     span.appendChild(boldSpan);

  //     // Append the main span to the document or other element
  //   } else {
  //     // If login failed, show an error message

  //     box_bottom_span_infoom.textContent = "* לא קיים תור, לחץ כאן לקבוע תור";
  //   }
  // } catch (error) {
  //   // Handle any errors that occur during the fetch
  //   console.error(error);
  //   document.getElementById("login-error").style.display = "block";
  //   document.getElementById("login-error-message").textContent =
  //     "אירעה שגיאה, אנא נסה שנית"; // Show error message for any failure
  // }
};

function navToHistory() {
  // window.location.href = "../history/history.html";
}
