const functions = require('firebase-functions')
const createAUser = require('./src/create_user')
const admin = require('firebase-admin')
const serviceAccount = require('./src/service_account.json')
const requestOneTimePassword = require('./src/request_one_time_password')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://one-time-password-469a3.firebaseio.com'
})

exports.createUser = functions.https.onRequest(createAUser)

exports.reqOneTimePassword = functions.https.onRequest(requestOneTimePassword)