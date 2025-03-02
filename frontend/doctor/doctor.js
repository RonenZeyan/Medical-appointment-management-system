document.addEventListener("DOMContentLoaded", loadAppointments);

async function loadAppointments() {
    const response = await fetch("http://localhost:3000/appointments/doctor");
    let appointments = await response.json();

    // מיון התורים לפי תאריך ושעה בסדר יורד
    appointments.sort((a, b) => {
        const dateTimeA = new Date(a.dateTime);
        const dateTimeB = new Date(b.dateTime);
        return dateTimeB - dateTimeA; // סדר יורד
    });

    const list = document.getElementById("appointments-list");
    list.innerHTML = "";

    appointments.forEach(app => {
        const row = document.createElement("tr");
        if (app.completed) row.classList.add("completed"); // סימון תור שהושלם

        row.innerHTML = `
            <td>${app.userName}</td>
            <td>${app._id}</td>
            <td>${new Date(app.dateTime).toLocaleDateString()}</td>
            <td>${new Date(app.dateTime).toLocaleTimeString()}</td>
            <td>${app.notes || ""}</td>
            <td><input type="checkbox" ${app.completed ? "checked" : ""} onchange="markAsCompleted('${app._id}', this.checked)"></td>
            <td><button onclick="cancelAppointment('${app._id}')">❌ ביטול</button></td>
        `;
        list.appendChild(row);
    });
}

async function cancelAppointment(appointmentId) {
    const response = await fetch(`http://localhost:3000/appointments/cancel/${appointmentId}`, {
        method: "DELETE"
    });
    if (response.ok) {
        alert("התור בוטל בהצלחה");
        loadAppointments();
    } else {
        alert("שגיאה בביטול התור");
    }
}

async function markAsCompleted(appointmentId, isChecked) {
    const response = await fetch(`http://localhost:3000/appointments/complete/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: isChecked })
    });
    if (response.ok) {
        loadAppointments();
    } else {
        alert("שגיאה בעדכון הסטטוס");
    }
}

// חיפוש מטופל לפי שם
function searchPatient() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const rows = document.querySelectorAll("#appointments-list tr");

    rows.forEach(row => {
        const patientName = row.cells[0].innerText.toLowerCase();
        if (patientName.includes(searchInput) || searchInput === "") {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}