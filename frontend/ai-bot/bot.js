

async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const output = document.getElementById('output');
  
    if (!userInput.trim()) {
      alert('אנא הזן הודעה!');
      return;
    }
  
    // הצגת הודעת המשתמש
    output.innerHTML += `
        <div class="me" style="display: flex; justify-content: right; align-items: flex-start; flex-direction: column;">
          <p style="padding: 20px; background-color: green; width: fit-content; border-radius: 20px; border-top-right-radius: 5px; color: white; font-weight: bolder;">${userInput}</p>
        </div>`;
  
    try {
        const token = localStorage.getItem("token"); // קבלת הטוקן מה-LS

        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // הוספת הטוקן לכותרת
            },
            body: JSON.stringify({ message: userInput }),
        });
  
      const data = await response.json();
  
      if (data.response) {
        output.innerHTML += `
        <div class="bot" style="display: flex; justify-content: left; align-items: flex-end; flex-direction: column;">
          <p style="padding: 20px; background-color: rgb(70, 70, 255); width: fit-content; border-radius: 20px; border-top-left-radius: 5px; color: white; font-weight: bolder; ">${data.response}</p>
        </div>
        `;
      } else {
        output.innerHTML += `
        <div class="bot" style="display: flex; justify-content: left; align-items: flex-end; flex-direction: column;">
          <p style="padding: 20px; background-color: red; width: fit-content; border-radius: 20px; border-top-left-radius: 5px; color: white; font-weight: bolder; ">שגיאה: תשובה לא זמינה</p>
        </div>
        `;
      }
    } catch (error) {
      output.innerHTML += `
        <div class="bot" style="display: flex; justify-content: left; align-items: flex-end; flex-direction: column;">
          <p style="padding: 20px; background-color: red; width: fit-content; border-radius: 20px; border-top-left-radius: 5px; color: white; font-weight: bolder; ">בעיה בחיבור לשרת :(</p>
        </div>
      `;
    }
  
    // ניקוי שדה הקלט לאחר שליחה
    document.getElementById('userInput').value = '';
  
    // גלילה אוטומטית למטה
    output.scrollTop = output.scrollHeight;
  }
  