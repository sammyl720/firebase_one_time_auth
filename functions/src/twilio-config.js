const Twilio = require('twilio')

const { accountSid, authToken } = require('./config')

module.exports = new Twilio(accountSid, authToken); 
