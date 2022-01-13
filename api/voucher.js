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
        console.log(voucher.start, getDate(), voucher.end)
        if (((voucher.end && voucher.start <= getDate()) || (!voucher.end && voucher.start === getDate())) && ((voucher.end && voucher.end >= getDate()) || !voucher.end)) {
          admin.database().ref().child(`shops/${shopid}/services/${voucher.service}`)
          .once('value', (snapshot2) => {
            if (snapshot2.exists()) {
              const serverId = snapshot2.val().server
              admin.database().ref().child(`servers/${serverId}`)
              .once('value', (snapshot3) => {
                if (snapshot3.exists()) {
                  const server = snapshot3.val()
                  console.log(server)
                  res.json({voucher: true})
                } else {
                  res.json({voucher: false, error: 'server not exist'})
                }
              })
            } else {
              res.json({voucher: false, error: 'service not exist'})
            }
          })
          return
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
