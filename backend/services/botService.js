const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ChatLog = require('../models/chatLogs');


const instructions = `
0. אם המשתמש אמר "שלום" או "היי" או משהו דומה, אז אתה עובר לשלב 1 ושואל את השאלה.
1. שאל את השאלה הבאה: "איפה נמצא הכאב? לדוגמה: בכאב ראש, כאב בטן, כאב בחזה?"
2. אם התשובה היא "כאב ראש", שאל את השאלה הבאה: "האם יש לחץ באזור המצח?"
    אם התשובה היא "כן" או "נכון" או חיובית, השב עם: "סביר להניח שזה כאב ראש סינוסי." 
    המלצה: "שתה מים חמים עם לימון, קח משככי כאבים אם צריך."
    אם התשובה היא "לא", השב עם: "סביר להניח שזה מיגרנה."
    המלצה: "נסה לנוח בחדר חשוך ושקט."
3. אם התשובה היא "כאב בטן", שאל: "האם הכאב ממוקד או מתפשט?"
    אם התשובה היא "ממוקד", המלצה: "יכול להיות שזה חומציות יתר, נסה תרופות נוגדות חומצה."
    אם התשובה היא "מתפשט", המלצה: "חפש טיפול רפואי מיידי."
4. אם התשובה היא "כאב בחזה", שאל: "האם הכאב מקרין אל היד השמאלית?"
    אם התשובה היא "כן", השב עם: "יכול להיות שזה בעיה בלב. התקשר לשירותי חירום מיד."
    אם התשובה היא "לא", השב עם: "יכול להיות שזה מתיחות שרירים, אך עקוב אחר מצבך."
`;

const botInstructions = `
אתה בוט רפואי שמספק ייעוץ ראשוני על סמך סדרת הנחיות רפואיות בלבד ואסור לך לענות על שאלות שאינן רפואיות.
אם השאלה קשורה לרפואה אך אינה כלולה בהנחיות, השב עם: "סליחה, אני לא יודע, כדאי לקבוע תור לרופא. רפואה שלמה!"
הנה ההנחיות:
${instructions}

המצבים בנויים ממספר שאלות שמובילות לתשובות על סמך תסמינים רפואיים.
אם השאלה של המשתמש אינה קשורה למצב רפואי או אינה נוגעת לבריאות או לרפואה חירומית, אתה צריך להשיב עם:
"סליחה, אני בוט רפואי ואינני יכול לעזור בשאלה שאינה קשורה לבריאות או לרפואה חירומית."

אנא ודא שהשאלות שאתה שואל תמיד מבוססות על ההנחיות ולא סוטות מהן.
`;

const sessionHistory = {};

async function run(userMessage, userId) {
    // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ההנחיות הקבועות לבוט
    const botInstructions = `
    You are a medical bot providing preliminary advice based on a series of medical instructions only.
    You must not answer non-medical questions.
    If a question is not related to health, respond with:
    "Sorry, I am a medical bot and cannot help with a question that is not related to health or emergency medicine."
    
    For pain-related inquiries, please follow the below guidelines:
    
    1. **Headache**:
        - If the user says they have a headache, ask: "Is there pressure in the forehead area?"
            - If "yes" or "true", respond: "Likely a sinus headache."
                Recommendation: "Drink hot water with lemon, take painkillers if needed. If the pain persists for more than 24 hours, consult a doctor."
            - If "no", respond: "Likely a migraine."
                Recommendation: "Try resting in a dark, quiet room. If the pain worsens, seek medical attention."
    
    2. **Stomach Pain**:
        - Ask: "Is the pain localized or spreading?"
            - If "localized", recommend: "It could be indigestion, try antacids."
            - If "spreading", recommend: "Seek medical attention immediately. If accompanied by nausea, call an emergency service."
    
    3. **Chest Pain**:
        - Ask: "Does the pain radiate to the left arm?"
            - If "yes", respond: "It could be a heart issue. Call emergency services immediately."
            - If "no", respond: "It could be muscle strain, but monitor your condition. If the pain does not improve, see a doctor."
    
    4. **Others**:
        - If the bot cannot identify the issue or if the question is not related to the provided guidelines, respond: 
        "Sorry, I could not identify your issue. It is recommended to consult a doctor for a proper diagnosis."
    `;




    // אם זו הפעם הראשונה של המשתמש, נתחיל היסטוריה חדשה עם ההנחיות
    if (!sessionHistory[userId]) {
        sessionHistory[userId] = [
            { role: "user", parts: [{ text: botInstructions }] } // ההנחיות נשמרות בהיסטוריה
        ];
    }

    // הוספת ההודעה החדשה של המשתמש להיסטוריה
    sessionHistory[userId].push({ role: "user", parts: [{ text: userMessage }] });


    const chat = model.startChat({
        history: sessionHistory[userId],
        generationConfig: {
            maxOutputTokens: 100,
        },
    });

    // שליחת ההודעה האחרונה למודל
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const botMessage = response.text();

    // שמירת תגובת הבוט להיסטוריה
    sessionHistory[userId].push({ role: "model", parts: [{ text: botMessage }] });

    // שמירת המלצות (לדוגמה: המלצה להיוועץ עם רופא)
    const recommendations = extractRecommendations(botMessage);

    // שמירת השיחה וההמלצות ב-ChatLogs
    await saveChatLog(userId, sessionHistory[userId], recommendations);
    console.log(botMessage);
    return botMessage;
}


async function saveChatLog(userId, chatHistory, recommendations) {
    try {
        // קבלת התאריך של היום בלי שעות (00:00:00) כדי לחפש מסמך מהיום
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // חיפוש מסמך קיים של אותו משתמש מהיום
        let chatLog = await ChatLog.findOne({
            userId: userId,
            createdAt: { $gte: today } // מסמך שנוצר מהיום ב-00:00 ומעלה
        });

        if (chatLog) {
            // אם נמצא מסמך מהיום, נוסיף לו את ההיסטוריה החדשה ואת ההמלצות
            chatLog.chatHistory.push(...chatHistory);
            chatLog.recommendations.push(...recommendations);
        } else {
            // אם אין מסמך מהיום, ניצור חדש
            chatLog = new ChatLog({
                userId: userId,
                chatHistory: chatHistory,
                recommendations: recommendations
            });
        }

        // שמירת המסמך המעודכן או החדש
        await chatLog.save();
    } catch (error) {
        console.error('Error saving chat log:', error.message);
    }
}

// פונקציה לשאוב המלצות מתוך ההודעה
function extractRecommendations(botMessage) {
    const recommendations = [];

    // ביטוי רגולרי למציאת כל מילה שמתחילה ב-"recommend" + מה שאחריה
    const match = botMessage.match(/\brecommend\w*\b.*$/i);

    if (match) {
        recommendations.push({ text: match[0] }); // שומר את כל ההמלצה שמתחילה ב-"recommend"
    }

    return recommendations;
}


module.exports = {
    run,
}