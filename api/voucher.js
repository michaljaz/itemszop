const app = require('express')()
const cors = require('cors')
import * as admin from 'firebase-admin'
import { Rcon } from 'rcon-client'

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
  if (/^[a-z0-9]{6,}$/.test(code) && /^[a-zA-Z0-9_]{2,16}$/.test(nick)) {
    admin.database().ref().child(`vouchers/${shopid}/${code}`)
    .once('value', (snapshot) => {
      if (snapshot.exists()) {
        admin.database().ref().child(`vouchers/${shopid}/${code}`).remove()
        const voucher = snapshot.val()
        if (((voucher.end && voucher.start <= getDate()) || (!voucher.end && voucher.start === getDate())) && ((voucher.end && voucher.end >= getDate()) || !voucher.end)) {
          admin.database().ref().child(`shops/${shopid}/services/${voucher.service}`)
          .once('value', (snapshot2) => {
            if (snapshot2.exists()) {
              const service = snapshot2.val()
              const commands = service.commands.split('\n')
              admin.database().ref().child(`servers/${service.server}`)
              .once('value', (snapshot3) => {
                if (snapshot3.exists()) {
                  const server = snapshot3.val()
                  let count = 0
                  for (let command of commands) {
                    command = command.replace(/\[nick\]/g, nick)
                    const config = {
                      host: server.serverIp,
                      port: server.serverPort,
                      password: server.serverPassword
                    }
                    Rcon.connect(config).then((rcon) => {
                      rcon.send(command)
                        .then((response) => {
                          count++
                          if (count === commands.length) {
                            res.json({voucher: true})
                          }
                        })
                        .catch((e) => {
                          res.json({voucher: false, error: 'command error'})
                        })
                    }).catch((e) => {
                      res.json({voucher: false, error: 'auth error'})
                    })
                  }
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
