const admin = require('firebase-admin')
module.exports = (request, response) => {
  // Verify the user provided a phone
  if (!request.body.phone) {
    return response.status(422).send({ error: 'Bad Input' })
  }
  // Format the phone number to remove dashes and parens
  const phone = String(request.body.phone).replace(/[^\d]/g, '')
  // create a new user account using that phone number
  admin
    .auth()
    .createUser({ uid: phone })
    .then((user) => {
      return response.send(user)
    })
    .catch((err) => {
      return response.status(422).send({ error: err })
    })
  // response to the user request, saying the account was made
}
