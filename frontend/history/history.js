document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/api/appointment", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const historyList = document.getElementById("historyList");
        historyList.innerHTML = "";

        if (data.length === 0) {
            historyList.innerHTML = "<li>אין תורים קודמים</li>";
            return;
        }

        data.forEach(appointment => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <div>📅 ${new Date(appointment.appointment_date).toLocaleDateString()}</div>
                <div>👨‍⚕️ רופא: ${appointment.doctor?.name || "לא ידוע"}</div>
                <div>🏥 תחום: ${appointment.medical_field?.name || "לא ידוע"}</div>
                <div>📍 מרפאה: ${appointment.clinic_address?.name || "לא ידוע"}</div>
                <div>${appointment.appointment_status === "completed" ? "✅ הושלם" : "❌ בוטל"}</div>
            `;
            historyList.appendChild(listItem);
        });

        // כפתור ייצוא ל-PDF
        document.getElementById("exportPdf").addEventListener("click", function () {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // הגדרת הגופן לעברית (השתמש בגופן עברי שנמצא ברוב הדפדפנים)
            doc.setFont("helvetica", "normal"); // גופן רגיל
            doc.setFontSize(12);

            doc.text("היסטוריית תורים", 10, 10);

            let y = 20;
            data.forEach((appointment, index) => {
                doc.setFont("helvetica", "normal");
                doc.text(`${index + 1}. ${new Date(appointment.appointment_date).toLocaleDateString()} | רופא: ${appointment.doctor?.name || "לא ידוע"}`, 10, y);
                doc.text(`   תחום: ${appointment.medical_field?.name || "לא ידוע"} | מרפאה: ${appointment.clinic_address?.name || "לא ידוע"}`, 10, y + 5);
                doc.text(`   סטטוס: ${appointment.appointment_status === "completed" ? "✅ הושלם" : "❌ בוטל"}`, 10, y + 10);
                y += 20;
            });

            doc.save("history.pdf"); // שמירת הקובץ
        });
    })
    .catch(error => console.error("שגיאה בטעינת ההיסטוריה:", error));
});
