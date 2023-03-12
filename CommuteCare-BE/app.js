const express = require('express');
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

const app = express();

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://commutecare.azurewebsites.net');
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


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

connectDB();

app.listen(port, () => console.log("hello there") );

