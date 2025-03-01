document.getElementById("appointment-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const userName = document.getElementById("userName").value;
    const specialty = document.getElementById("specialty").value;
    const doctor = document.getElementById("doctor").value;
    const region = document.getElementById("region").value;
    const dateTime = document.getElementById("dateTime").value;

    const response = await fetch("http://localhost:3000/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, specialty, doctor, region, dateTime })
    });

    if (response.ok) {
        alert("תור נקבע בהצלחה!");
        loadAppointments(userName);
    } else {
        alert("שגיאה בקביעת התור");
    }
});

async function loadAppointments(userName) {
    const response = await fetch(`http://localhost:3000/appointments/list/${userName}`);
    const appointments = await response.json();
    const list = document.getElementById("appointments-list");
    list.innerHTML = "";

    const now = new Date();

    appointments.forEach(app => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${app.specialty}</strong> אצל ד״ר ${app.doctor}<br>
            תאריך: ${new Date(app.dateTime).toLocaleDateString()}<br>
            שעה: ${new Date(app.dateTime).toLocaleTimeString()}<br>
            אזור: ${app.region}
        `;

        const appDate = new Date(app.dateTime);
        const timeDiff = (appDate - now) / (1000 * 60 * 60); // הבדלי שעות
        if (timeDiff < 24) {
            li.classList.add("urgent");
        }

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "ביטול";
        cancelButton.classList.add("cancel-btn");
        cancelButton.onclick = () => cancelAppointment(app._id, userName);

        li.appendChild(cancelButton);
        list.appendChild(li);
    });
}

async function cancelAppointment(appointmentId, userName) {
    const response = await fetch(`http://localhost:3000/appointments/cancel/${appointmentId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        alert("התור בוטל בהצלחה");
        loadAppointments(userName);
    } else {
        alert("שגיאה בביטול התור");
    }
}