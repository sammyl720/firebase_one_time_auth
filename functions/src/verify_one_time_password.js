const admin = require('firebase-admin')
module.exports = async (req, res) => {
  if (!req.body.code || !req.body.phone) {
    return res.status(422).send({ error: 'Phone and code must be provided'})
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '')
  const code = parseInt(req.body.code)

  try {
    await admin.auth().getUser(phone)
    const ref = admin.database().ref(`users/${phone}`)
    await ref.on('value', async (snapshot) => {
      ref.off() // stop listening for values
      const user = snapshot.val()
      if (user.code !== code || !user.codeValid) {
        return res.status(422).send({ error: 'Code not valid' })
      }
      await ref.update({ codeValid: false })
      const token = await admin.auth().createCustomToken(phone)

      return res.send({ token })
    })
  } catch (err) {
    return res.status(422).send({ error: err })
  }

}