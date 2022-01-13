const app = require('express')()
const cors = require('cors')
import * as admin from 'firebase-admin'

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY === undefined) {
  console.log('FIREBASE_SERVICE_ACCOUNT_KEY is not set')
} else {
  const buff = new Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64')
  const text = buff.toString('ascii')
  const serviceAccount = JSON.parse(text)
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    })
  }
}

function getDate () {
  let d = new Date()
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
  return `${ye}-${mo}-${da}`
}

app.use(cors())
app.get('/api/voucher', async (req, res) => {
  const { shopid, nick, code } = req.query
  if (/^[a-z0-9]{6,}$/.test(code)) {
    admin.database().ref().child(`vouchers/${shopid}/${code}`)
    .once('value', (snapshot) => {
      if (snapshot.exists()) {
        admin.database().ref().child(`vouchers/${shopid}/${code}`).remove()
        const voucher = snapshot.val()
        if (voucher.start <= getDate()) {
          if (voucher.end) {
            if (voucher.end >= getDate()) {
              res.json({voucher: true})
              return
            }
          } else {
            res.json({voucher: true})
            return
          }
        }
        res.json({voucher: false, error: 'expired'})
      } else {
        res.json({voucher: false, error: 'not exist'})
      }
    })
  } else {
    res.json({voucher: false, error: 'wrong format'})
  }
})

module.exports = app
