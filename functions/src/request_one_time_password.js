const admin = require('firebase-admin')
const client = require('./twilio-config')
const functions = require('firebase-functions')


module.exports = async (req, res) => {
  if(!req.body.phone){
    functions.logger.log(`Phone number is a required field`)
    return res.status(422).send({ error: 'You must provide a phone number'})
  }


  const phone = String(req.body.phone).replace(/[^\d]/g, '')

  try {
    // retrieve user
    const userRecord = await admin.auth().getUser(phone)
    functions.logger.log(`user found ${userRecord.uid}`)

    // generate code
    const code = Math.floor(Math.random() * 8999 + 1000)

    // send text message with code
    const message = await client.messages.create({
      body: `Your code is ${code}`,
      to: phone,
      from: '+16016204251'
    })
    functions.logger.log(`twilio sent ${message.sid}`)
    // ? update user code
    await admin.database().ref(`users/${phone}`).update({ code, codeValid: true })
    functions.logger.log(`added code to database ${code}`)
    // return success response
    return res.send({ success: true })
  } catch (error) {
    functions.logger.log(`Error thrown`)
    return res.status(422).send({ error })
  }
}
