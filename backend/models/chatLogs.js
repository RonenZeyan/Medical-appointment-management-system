const mongoose = require('mongoose');


// מודל ל-ChatLogs
const chatLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    chatHistory: [{
        senderName: {
            type: String,
            required: true
        }, // שם השולח ('user' עבור המשתמש, 'bot' עבור הבוט)
        messageContent: {
            type: String,
            required: true
        } // תוכן ההודעה
    }],
    recommendations: [{
        text: String,
        timestamp: { type: Date, default: Date.now }
    }]
},
    {
        timestamps: true,
    }

);

const ChatLog = mongoose.model('ChatLog', chatLogSchema);

module.exports = ChatLog;
