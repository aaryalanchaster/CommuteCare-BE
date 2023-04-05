const request = require('supertest');
const app = require('../app');
const Helper = require('../models/helperModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const moment = require('moment');

describe('GET /availableHelpers', () => {
  let user;
  let helper1;
  let helper2;
  let booking1;

  before(async () => {
    // Create a user
    user = new User({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      email_verified: true,
    });
    await user.save();

    // Create two helpers with availability on Monday from 9:00-11:00 and 12:00-14:00 respectively
    helper1 = new Helper({
      name: 'Helper 1',
      email: 'helper1@example.com',
      availability: {
        Monday: '09:00,11:00',
      },
    });
    await helper1.save();

    helper2 = new Helper({
      name: 'Helper 2',
      email: 'helper2@example.com',
      availability: {
        Monday: '09:00,11:00',
      },
    });
    await helper2.save();

    // Create a booking for helper1 on Monday from 10:00-11:00
    booking1 = new Booking({
      user: user._id,
      helper: helper1._id,
      day: 'Monday',
      starttime: moment('10:00', 'hh:mm').toDate(),
      endtime: moment('10:59', 'hh:mm').toDate(),
    });
    await booking1.save();
  });

  after(async () => {
    // Clean up the database after the tests are done
    await User.deleteMany({});
    await Helper.deleteMany({});
    await Booking.deleteMany({});
  });

  it('should return available helpers for a valid request', async () => {
    const res = await request(app)
      .get('/availableHelpers')
      .query({ day: 'Monday', time: '10:00', duration: '15' })
      .set('Authorization', `Bearer ${user.generateAuthToken()}`);

    // Expect the response to have a 200 status code
    expect(res.status).to.equal(200);

    // Expect the response body to be an array with only helper2
    expect(res.body).to.be.an('array').that.has.lengthOf(1);
    expect(res.body[0]._id.toString()).to.equal(helper2._id.toString());
  });

  it('should return an error if the user is not verified', async () => {
    user.email_verified = false;
    await user.save();

    const res = await request(app)
      .get('/availableHelpers')
      .query({ day: 'monday', time: '13:00', duration: '60' })
      .set('Authorization', `Bearer ${user.generateAuthToken()}`);

    // Expect the response to have a 403 status code
    expect(res.status).to.equal(403);

    // Expect the response body to be a string containing "Email address not verified"
    expect(res.text).to.contain('Email address not verified');
  });
});
