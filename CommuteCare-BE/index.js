const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');


const connectDB = require('./services/db');
const availableHelpersRoutes = require('./routes/availableHelpersRoute');
const createBookingRoutes = require('./routes/createBookingRoute');
const LoginRoutes = require('./routes/LoginRoute');
const SignupRoutes = require('./routes/SignupRoute');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoute');
const resetPasswordRoutes = require('./routes/resetPasswordRoute');
const deleteBookingRoutes = require('./routes/deleteBookingRoute');
const editAvailabilityRoutes = require('./routes/editAvailabilityRoute');
const verifyOTPRoutes = require('./routes/verifyOTPRoute');
const resendOTPRoutes = require('./routes/resendOTPRoute');
const additionalDetailsRoutes = require('./routes/additionalDetailsRoute.js')
const getUserProfileRoutes= require('./routes/userProfileRoute.js')
const getHelperProfileRoutes= require('./routes/helperProfileRoute.js')
const messageRoutes = require("./routes/messageRoute.js");
const getBookingRoutes = require('./routes/getBookingRoute');
const feedbackRoutes = require('./routes/feedbackRoute');
const completeHelpRoutes = require('./routes/completeHelpRoute');
const getUserBookingHistoryRoutes = require('./routes/getBookingRoute');
const reportRoutes = require('./routes/reportRoute');


const app = express();
const socket = require("socket.io");

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>


app.use(bodyParser.json()); // application/json

app.use('/', availableHelpersRoutes);
app.use('/', createBookingRoutes);
app.use('/', LoginRoutes);
app.use('/', SignupRoutes);
app.use('/', forgotPasswordRoutes);
app.use('/', resetPasswordRoutes);
app.use('/', deleteBookingRoutes);
app.use('/', editAvailabilityRoutes);
app.use('/', verifyOTPRoutes);
app.use('/', resendOTPRoutes);
app.use('/', additionalDetailsRoutes);
app.use('/', getUserProfileRoutes);
app.use('/', getHelperProfileRoutes);
app.use('/', messageRoutes)
app.use('/', getBookingRoutes);
app.use('/', feedbackRoutes);
app.use('/', completeHelpRoutes);
app.use('/', getUserBookingHistoryRoutes);
app.use('/', reportRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

connectDB();

const server=app.listen(port, () => console.log("hello there") );

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const connectedUsers = {}; // object to store connected users
const connectedHelpers = {}; // object to store connected helpers

// Socket.io connection event
io.on('connection', (socket) => {
  // When a user connects, store their ID in the connectedUsers object
  socket.on('userConnected', (userId) => {
    connectedUsers[userId] = socket.id;
  });

  // When a helper connects, store their ID in the connectedHelpers object
  socket.on('helperConnected', (helperId) => {
    connectedHelpers[helperId] = socket.id;
  });

  // When a user sends a message, send it to the connected helper only
  socket.on('userMessage', ({ userId, message }) => {
    const helperSocketId = connectedUsers[userId];
    if (helperSocketId) {
      io.to(helperSocketId).emit('userMessage', { userId, message });
    }
  });

  // When a helper sends a message, send it to the connected user only
  socket.on('helperMessage', ({ helperId, message }) => {
    const userSocketId = connectedHelpers[helperId];
    if (userSocketId) {
      io.to(userSocketId).emit('helperMessage', { helperId, message });
    }
  });
});
