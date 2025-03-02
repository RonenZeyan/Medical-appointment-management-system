//modules imports
const express = require("express");
const { chat, getChatHistory } = require("../controllers/botController");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/",verifyToken,chat);
router.get("/history",verifyToken,getChatHistory);


module.exports = router;