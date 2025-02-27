const mongoose = require('mongoose');


// מודל ל-ChatLogs
const chatLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    chatHistory: [{
        role: {
            type: String,
            required: true
        }, // 'user' or 'model'
        parts: [{
            text: String
        }]
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
