//modules imports
const express = require("express");
const { chat } = require("../controllers/botController");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/",verifyToken,chat);


module.exports = router;