const io = require('socket.io');

// Define Socket.io connection
const socket = io()
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Helper = require("../models/helperModel");

// module.exports.getMessages = async (req, res, next) => {
//   try {
//     const { user, helper } = req.body;

//     // Get the user and helper objects based on their respective ids
//     const userObject = await User.findById(user);
//     const helperObject = await Helper.findById(helper);

//     if (!userObject) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     if (!helperObject) {
//       return res.status(404).json({ msg: "Helper not found" });
//     }

//     // Check if the helper is trying to chat with another helper
//     if (helperObject.type === "helper") {
//       return res
//         .status(403)
//         .json({ msg: "Helpers are not allowed to chat with each other" });
//     }

//     // Query messages based on user and helper ids
//     const messages = await Messages.find({
//       users: {
//         $elemMatch: {
//           _id: { $in: [user, helper] },
//           type: { $eq: userObject.type },
//         },
//       },
//       users: {
//         $elemMatch: {
//           _id: { $in: [user, helper] },
//           type: { $eq: helperObject.type },
//         },
//       },
//     }).sort({ updatedAt: 1 });

//     const projectedMessages = messages.map((msg) => {
//       return {
//         fromSelf: msg.sender.toString() === user,
//         message: msg.message.text,
//       };
//     });

//     res.json(projectedMessages);
//   } catch (ex) {
//     next(ex);
//   }
// };

module.exports.addMessageUser = async (req, res, next) => {
  const userId = req.body.userId;
  const helperId= req.body.helperId;
  const message= req.body.message;
  const user= await User.findById(userId)
  const helper= await Helper.findById(helperId)
  
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (!helper) {
    return res.status(400).json({ message: "Helper not found" });
  }
  // Save the message to the database
  const newMessage = new Message({ userId, helperId, message,sender: 'user' });
  await newMessage.save();

  // Emit the message to the helper
  socket.to(`helper_${helperId}`).emit('userMessage', { userId, message });

  // Retrieve the chat history from the database
  const messages = await Message.find({
    $or: [
      { userId, helperId },
      { userId: helperId, helperId: userId }
    ]
  }).sort({ timestamp: 1 }).select('-_id sender message');

  res.status(200).json({ messages });
};

module.exports.addMessageHelper = async (req, res, next) => {
  const { userId,helperId ,message } = req.body;
  const user= await User.findById(userId)
  const helper= await Helper.findById(helperId)
  
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (!helper) {
    return res.status(400).json({ message: "Helper not found" });
  }
  // Save the message to the database
  const newMessage = new Message({ userId, helperId, message,sender: 'helper' });
  await newMessage.save();

  // Emit the message to the user with the given userId
  socket.to(`user${userId}`).emit('helperMessage', { helperId, message });

  //Retrieve the chat history from the database
  const messages = await Message.find({
    $or: [
      { userId, helperId },
      { userId: helperId, helperId: userId }
    ]
  }).sort({ timestamp: 1 }).select('-_id sender message')

  res.status(200).json({ messages })
};

module.exports.getChatHistory = async (req, res) => {
  const userId = req.params.userId;
  const helperId = req.params.helperId;
  const messages = await Message.find({
    $or: [
      { userId, helperId },
      { userId: helperId, helperId: userId }
    ]
  }).sort({ timestamp: 1 }).select('-_id sender message');

  res.status(200).json({ messages })
}

