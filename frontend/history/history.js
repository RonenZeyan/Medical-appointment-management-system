document.addEventListener("DOMContentLoaded", async () => {
    const historyList = document.getElementById("historyList");

    try {
        const response = await fetch("http://localhost:3000/api/chat/history", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
        });

        const data = await response.json();

        if (!response.ok) {
            historyList.innerHTML = `<p class="error">${data.message || "שגיאה בטעינת ההיסטוריה."}</p>`;
            return;
        }

        if (!data.chatHistory || data.chatHistory.length === 0) {
            historyList.innerHTML = `<p class="no-history">📭 אין היסטוריית שיחות זמינה.</p>`;
            return;
        }

        data.chatHistory.forEach(chat => {
            const listItem = document.createElement("li");
            listItem.classList.add("chat-item");

            // יצירת סיכום עם התאריך של השיחה
            const summary = document.createElement("summary");
            summary.textContent = `📅 ${new Date(chat.createdAt).toLocaleString("he-IL")}`;

            // יצירת פרטי השיחה
            const details = document.createElement("details");
            details.appendChild(summary);

            chat.chatHistory.forEach(entry => {
                const messageDiv = document.createElement("div");
                messageDiv.classList.add(entry.senderName === "user" ? "user-message" : "bot-message");
                messageDiv.textContent = `${entry.senderName === "user" ? "👤" : "🤖"} ${entry.messageContent}`;
                details.appendChild(messageDiv);
            });

            listItem.appendChild(details);
            historyList.appendChild(listItem);
        });

    } catch (error) {
        console.error("❌ Error loading chat history:", error);
        historyList.innerHTML = `<p class="error">שגיאה בטעינת ההיסטוריה.</p>`;
    }
});

// פונקציה לחזרה לדף הקודם
function goBack() {
    window.history.back();
}
