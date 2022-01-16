import app from './lib/app.js'
import admin from './lib/admin.js'
import axios from 'axios'

app.get('/api/przelew', (req, res) => {
  const {status, userid, email, orderID, amountUni, amountPay, description, control, test} = req.query
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  axios.get('https://microsms.pl/psc/ips/').then((response) => {
    if (response.data.split(',').includes(ip) && status) {
      console.log(status, userid, email, orderID, amountUni, amountPay, description, control, test)
      const [nick, shopid, serviceId] = control.split('|')
      admin.database().ref().child(`shops/${shopid}/payments/paymentsUserId`).once('value', (snapshot) => {
        if (snapshot.exists() && snapshot.val() === userid) {
					// here will be sending to server and logging payment

          res.send('OK')
        } else {
          res.send('ERR')
        }
      })
    } else {
      res.send('ERR')
    }
  })
})

module.exports = app
