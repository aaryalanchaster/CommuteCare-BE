const express = require('express');
const router = express.Router();
const io = require('socket.io');
const { addMessageUser, addMessageHelper, getChatHistory } = require('../controllers/messageController');

// Define Socket.io connection

router.post("/addmsgUser", addMessageUser);
router.post("/addmsgHelper", addMessageHelper);
router.get("/getmsg/:userId/:helperId", getChatHistory);

module.exports = router;